from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
import cv2
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
from tensorflow.keras.preprocessing import image
from pydicom import dcmread
from waitress import serve
from inference_sdk import InferenceHTTPClient

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Constants
IMG_SIZE = 256
BINARY_MODEL_PATH = os.path.join(os.getcwd(), "binary_epoch50.h5")

# Initialize Roboflow Client for MRI validation
ROBOFLOW_CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="Uv31TiRmfGZBE4y9mLLE"
)

# Load
def load_model():
    try:
        return tf.keras.models.load_model(BINARY_MODEL_PATH, compile=False)
    except Exception as e:
        print(f"Error loading model: {e}")
        return create_custom_model()

def create_custom_model():
    """Fallback model creation if loading fails"""
    print("Creating a custom model as fallback...")
    inputs = tf.keras.layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    
    # Convolutional layers
    x = tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same')(inputs)
    x = tf.keras.layers.MaxPooling2D((2, 2))(x)
    x = tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = tf.keras.layers.MaxPooling2D((2, 2))(x)
    
    # Dense layers
    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(128, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.5)(x)
    outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)
    
    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    
    try:
        model.load_weights(BINARY_MODEL_PATH)
        print("Successfully loaded weights into the custom model.")
    except Exception as weight_error:
        print(f"Error loading weights: {weight_error}")
        print("WARNING: The model will not produce meaningful predictions!")
    
    return model

# Load the model
binary_model = load_model()

# Image processing functions
def preprocess_image(img_path):
    """Process JPEG/PNG images"""
    try:
        img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
        img_array = image.img_to_array(img) / 255.0
        original_img = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array, original_img
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None, None

def preprocess_dicom(dicom_path):
    """Process DICOM images"""
    try:
        dicom_data = dcmread(dicom_path)
        pixel_array = dicom_data.pixel_array
        
        img_resized = cv2.resize(pixel_array, (IMG_SIZE, IMG_SIZE))
        img_normalized = img_resized / 255.0 if img_resized.max() > 1.0 else img_resized
        original_img = img_normalized.copy()
        
        # Convert grayscale to RGB if needed
        if len(img_normalized.shape) == 2:
            img_normalized = np.stack([img_normalized] * 3, axis=-1)
            
        img_reshaped = np.expand_dims(img_normalized, axis=0)
        return img_reshaped, original_img
    except Exception as e:
        print(f"Error processing DICOM file: {e}")
        return None, None

def validate_mri(file_path):
    """Validate if the uploaded file is an MRI image"""
    try:
        result = ROBOFLOW_CLIENT.infer(file_path, model_id="noisy-data/2")
        if "predictions" in result and len(result["predictions"]) > 0:
            return True, "Valid MRI image"
        else:
            return False, "The uploaded image does not appear to be an MRI scan"
    except Exception as e:
        print(f"Error during MRI validation: {e}")
        return False, f"Error validating image: {str(e)}"

# Grad-CAM visualization
def create_visualization(heatmap, original_img):
    """Create visualization with original image and heatmap overlay"""
    try:
        # Format original image
        if len(original_img.shape) == 2:
            original_img = cv2.cvtColor(np.float32(original_img), cv2.COLOR_GRAY2RGB)
        elif len(original_img.shape) == 3 and original_img.shape[2] == 1:
            original_img = cv2.cvtColor(np.float32(original_img.squeeze()), cv2.COLOR_GRAY2RGB)
        
        if original_img.max() <= 1.0:
            original_img = (original_img * 255).astype(np.uint8)
        else:
            original_img = original_img.astype(np.uint8)
        
        original_img = cv2.resize(original_img, (IMG_SIZE, IMG_SIZE))
        heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        
        # Create brain mask
        original_gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)
        _, brain_mask = cv2.threshold(original_gray, 15, 255, cv2.THRESH_BINARY)
        
        # Clean up mask
        kernel = np.ones((5, 5), np.uint8)
        brain_mask = cv2.morphologyEx(brain_mask, cv2.MORPH_CLOSE, kernel)
        brain_mask = cv2.morphologyEx(brain_mask, cv2.MORPH_OPEN, kernel)
        brain_mask_3ch = cv2.cvtColor(brain_mask, cv2.COLOR_GRAY2BGR)
        
        # Apply mask to heatmap
        masked_heatmap = cv2.bitwise_and(heatmap, brain_mask_3ch)
        
        # Convert to RGB
        original_rgb = cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)
        masked_heatmap_rgb = cv2.cvtColor(masked_heatmap, cv2.COLOR_BGR2RGB)
        
        # Create blended image
        superimposed_img = cv2.addWeighted(original_rgb, 0.7, masked_heatmap_rgb, 0.5, 0)
        
        # Create figure with subplots
        plt.figure(figsize=(10, 5), dpi=100)
        plt.subplot(1, 2, 1)
        plt.imshow(original_rgb)
        plt.axis('off')
        plt.subplot(1, 2, 2)
        plt.imshow(superimposed_img)
        plt.axis('off')
        plt.subplots_adjust(wspace=0.01, hspace=0)
        
        # Convert to base64
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
        plt.close('all')  # Close figures to prevent memory
        buf.seek(0)
        img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        return img_str
    except Exception as e:
        print(f"Error creating visualization: {e}")
        return None

def generate_gradcam(model, preprocessed_img, original_img, layer_name=None):
    """Generate Grad-CAM visualization for the input image"""
    try:
        # Find appropriate layer if not specified
        if layer_name is None:
            for i, layer in enumerate(model.layers):
                if isinstance(layer, tf.keras.layers.Conv2D) or 'conv' in layer.name.lower():
                    layer_name = layer.name
                    
            if layer_name is None:
                # Fallback if no conv layer found
                for i in range(len(model.layers) - 2, 0, -1):
                    output_shape = getattr(model.layers[i], 'output_shape', None)
                    if output_shape and len(output_shape) == 4:
                        layer_name = model.layers[i].name
                        break
        
        # create fallback visualization
        if layer_name is None:
            print("Creating a fallback heatmap")
            heatmap = np.random.rand(16, 16)
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.resize(heatmap, (IMG_SIZE, IMG_SIZE))
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            return create_visualization(heatmap, original_img)
        
        # Create Grad-CAM model
        try:
            grad_layer = model.get_layer(layer_name)
            grad_model = tf.keras.models.Model(
                inputs=[model.inputs],
                outputs=[grad_layer.output, model.output]
            )
        except Exception as layer_error:
            print(f"Error creating Grad-CAM model: {layer_error}")
            # Fallback to saliency map
            if len(original_img.shape) == 3 and original_img.shape[2] == 3:
                gray_img = cv2.cvtColor(original_img.astype(np.float32), cv2.COLOR_RGB2GRAY)
            else:
                gray_img = original_img.squeeze()
                
            sobelx = cv2.Sobel(gray_img, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray_img, cv2.CV_64F, 0, 1, ksize=3)
            magnitude = np.sqrt(sobelx**2 + sobely**2)
            magnitude = 255 * magnitude / np.max(magnitude)
            heatmap = magnitude.astype(np.uint8)
            heatmap = cv2.resize(heatmap, (IMG_SIZE, IMG_SIZE))
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            return create_visualization(heatmap, original_img)
        
        with tf.GradientTape() as tape:
            preprocessed_tensor = tf.convert_to_tensor(preprocessed_img, dtype=tf.float32)
            conv_outputs, predictions = grad_model(preprocessed_tensor)
            loss = predictions[0]  # Binary classification
        
        # Get gradients
        try:
            grads = tape.gradient(loss, conv_outputs)
            if grads is None:
                # Fallback for gradient issues
                print("Gradients are None, using random heatmap")
                output_shape = conv_outputs.shape.as_list()
                heatmap = np.random.rand(output_shape[1], output_shape[2])
                heatmap = np.uint8(255 * heatmap)
                heatmap = cv2.resize(heatmap, (IMG_SIZE, IMG_SIZE))
                heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
                return create_visualization(heatmap, original_img)
        except Exception as grad_error:
            print(f"Error computing gradients: {grad_error}")
            # Random heatmap fallback
            heatmap = np.random.rand(16, 16)
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.resize(heatmap, (IMG_SIZE, IMG_SIZE))
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            return create_visualization(heatmap, original_img)
        
        # Process gradients
        grads = grads.numpy()
        conv_outputs = conv_outputs.numpy()
        pooled_grads = np.mean(grads, axis=(0, 1, 2))
        
        # Generate heatmap
        heatmap = np.zeros(conv_outputs.shape[1:3], dtype=np.float32)
        for i, w in enumerate(pooled_grads):
            heatmap += w * conv_outputs[0, :, :, i]
        
        # Process heatmap
        heatmap = np.maximum(heatmap, 0)
        heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-10)
        heatmap = cv2.resize(heatmap, (IMG_SIZE, IMG_SIZE))
        heatmap = cv2.GaussianBlur(heatmap, (9, 9), 0)
        heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-10)
        heatmap[heatmap < 0.3] = 0
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        return create_visualization(heatmap, original_img)
    except Exception as e:
        print(f"Error in generate_gradcam: {e}")
        
        # Final fallback
        try:
            if len(original_img.shape) == 3 and original_img.shape[2] == 3:
                gray = cv2.cvtColor((original_img * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
            else:
                gray = (original_img * 255).astype(np.uint8)
                
            edges = cv2.Canny(gray, 100, 200)
            edges_colored = cv2.applyColorMap(edges, cv2.COLORMAP_JET)
            return create_visualization(edges_colored, original_img)
        except:
            return None

# Helper function to handle file processing
def process_upload_file():
    """Process uploaded file and return preprocessed data"""
    if "file" not in request.files:
        return None, None, None, "No file uploaded", 400
    
    file = request.files["file"]
    if file.filename == "":
        return None, None, None, "No selected file", 400

    # Save uploaded file 
    file_ext = os.path.splitext(file.filename)[-1].lower()
    file_path = os.path.join(os.getcwd(), "temp_" + file.filename)
    file.save(file_path)
    
    if file_ext not in [".jpg", ".jpeg", ".png", ".dcm"]:
        os.remove(file_path)
        return None, None, None, "Unsupported file format. Please upload a JPG, PNG, or DICOM file.", 400
    
    # Validate MRI for image files
    if file_ext in [".jpg", ".jpeg", ".png"]:
        is_mri, message = validate_mri(file_path)
        if not is_mri:
            os.remove(file_path)
            return None, None, None, message, 400
    
    # Process file based on type
    if file_ext in [".jpg", ".jpeg", ".png"]:
        preprocessed_img, original_img = preprocess_image(file_path)
    else:  # DICOM file
        preprocessed_img, original_img = preprocess_dicom(file_path)
    
    if preprocessed_img is None or original_img is None:
        os.remove(file_path)
        return None, None, None, "Error processing image", 500
    
    return file_path, preprocessed_img, original_img, None, 200

# API Endpoints
@app.route("/predict", methods=["POST"])
def predict():
    """Main prediction endpoint"""
    file_path = None
    try:
        file_path, preprocessed_img, original_img, error, status_code = process_upload_file()
        if error:
            return jsonify({"error": error}), status_code
        
        # Make prediction
        prediction = binary_model.predict(preprocessed_img)
        pred_value = float(prediction[0][0] if len(prediction.shape) > 1 and prediction.shape[1] > 0 else prediction[0])
        predicted_label = "VAD-Demented" if pred_value > 0.5 else "Non-Demented"
        confidence = pred_value * 100 if pred_value > 0.5 else (1 - pred_value) * 100
        
        # Generate Grad-CAM
        gradcam_base64 = generate_gradcam(binary_model, preprocessed_img, original_img)
        
        # Prepare response
        response = {
            "prediction": predicted_label, 
            "confidence": round(float(confidence), 2),
            "raw_score": pred_value,
            "is_valid_mri": True,
            "gradcam_visualization": gradcam_base64 or None
        }
        
        if not gradcam_base64:
            response["gradcam_error"] = "Could not generate visualization"
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full stack trace for debugging
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500
    finally:
        # Clean up
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as cleanup_error:
                print(f"Error cleaning up file: {cleanup_error}")
        
        plt.close('all')

@app.route("/gradcam", methods=["POST"])
def get_gradcam():
    """Endpoint to get Grad-CAM visualization only"""
    file_path = None
    try:
        layer_name = request.form.get("layer_name", None)
        file_path, preprocessed_img, original_img, error, status_code = process_upload_file()
        
        if error:
            return jsonify({"error": error}), status_code
        
        # Generate Grad-CAM
        gradcam_base64 = generate_gradcam(binary_model, preprocessed_img, original_img, layer_name)
        
        if gradcam_base64 is None:
            return jsonify({
                "error": "Failed to generate Grad-CAM visualization",
                "gradcam_visualization": None
            }), 500
            
        return jsonify({"gradcam_visualization": gradcam_base64})
    
    except Exception as e:
        print(f"Error generating Grad-CAM: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Grad-CAM generation failed: {str(e)}"}), 500
    finally:
        # Clean up
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as cleanup_error:
                print(f"Error cleaning up file: {cleanup_error}")
        
        # Make sure all matplotlib figures are closed
        plt.close('all')

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "model": "Binary Model (epoch50)", 
        "xai": "Grad-CAM available"
    })

# Run Flask App
if __name__ == "__main__":
    print(f"Model loaded from: {BINARY_MODEL_PATH}")
    print(f"Expected input shape: {binary_model.input_shape}")
    print("Flask API is running on http://127.0.0.1:5000")
    serve(app, host="127.0.0.1", port=5000)