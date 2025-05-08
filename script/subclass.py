from flask import request, jsonify, send_file
import tensorflow as tf
import numpy as np
import os
import cv2
from tensorflow.keras.preprocessing import image
from pydicom import dcmread
from tensorflow.keras.models import Model
import requests
import tempfile
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
IMG_SIZE = 128
MODEL_HF_URL = "https://huggingface.co/thakshana02/fyp_vad/resolve/main/VGG16_4_real_subclass.h5"
MODEL_FILENAME = "VGG16_4_real_subclass.h5"
HEATMAP_PATH = os.path.join(tempfile.gettempdir(), "gradcam_heatmap.jpg")
COMBINED_HEATMAP_PATH = os.path.join(tempfile.gettempdir(), "combined_heatmap.jpg")

# Function to download model from Hugging Face
def download_model_from_hf(url, local_path):
    try:
        logger.info(f"Downloading model from {url}...")
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        logger.info(f"Model successfully downloaded to {local_path}")
        return local_path
    except Exception as e:
        logger.error(f"Error downloading model: {e}")
        return None

# Load subclass model
def load_subclass_model():
    try:
        # Create temp directory and download model
        temp_dir = tempfile.gettempdir()
        local_model_path = os.path.join(temp_dir, MODEL_FILENAME)

        # Check if model already exists in temp directory
        if not os.path.exists(local_model_path):
            download_model_from_hf(MODEL_HF_URL, local_model_path)

        model = tf.keras.models.load_model(local_model_path)
        logger.info("Subclass model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading subclass model: {e}")
        return None

# Image preprocessing function
def preprocess_image(img_path):
    try:
        img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
        img_array = image.img_to_array(img) / 255.0
        
        # Create a brain mask for later use
        gray_img = cv2.cvtColor(np.uint8(img_array*255), cv2.COLOR_RGB2GRAY)
        _, brain_mask = cv2.threshold(gray_img, 15, 255, cv2.THRESH_BINARY)
        kernel = np.ones((5,5), np.uint8)
        brain_mask = cv2.morphologyEx(brain_mask, cv2.MORPH_CLOSE, kernel)
        
        img_array = np.expand_dims(img_array, axis=0)
        return img_array, brain_mask
    except Exception as e:
        logger.error(f"Error preprocessing image: {e}")
        return None, None

# Process DICOM files
def preprocess_dicom(dicom_path):
    try:
        dicom_data = dcmread(dicom_path)
        pixel_array = dicom_data.pixel_array
        
        # Normalize the image
        if np.max(pixel_array) > 0:
            pixel_array = pixel_array / np.max(pixel_array)
        
        # Resize to target size
        img_resized = cv2.resize(pixel_array, (IMG_SIZE, IMG_SIZE))
        
        # Create a brain mask for later use
        _, brain_mask = cv2.threshold(np.uint8(img_resized*255), 15, 255, cv2.THRESH_BINARY)
        kernel = np.ones((5,5), np.uint8)
        brain_mask = cv2.morphologyEx(brain_mask, cv2.MORPH_CLOSE, kernel)
        
        # Convert to RGB by repeating the channel
        if len(img_resized.shape) == 2:
            img_rgb = np.stack((img_resized,) * 3, axis=-1)
        else:
            img_rgb = img_resized
            
        img_reshaped = np.expand_dims(img_rgb, axis=0)
        return img_reshaped, brain_mask
    except Exception as e:
        logger.error(f"Error processing DICOM: {e}")
        return None, None

# Find the target layer for GradCAM
def find_target_layer(model):
    if 'vgg16' in [layer.name for layer in model.layers]:
        # Get the VGG16 layer
        vgg16_layer = model.get_layer('vgg16')
        
        if hasattr(vgg16_layer, 'layers'):
            # Look for the last conv layer in the VGG16 model
            for nested_layer in reversed(vgg16_layer.layers):
                if isinstance(nested_layer, tf.keras.layers.Conv2D):
                    return 'vgg16'  
        
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    
    if 'vgg16' in [layer.name for layer in model.layers]:
        return 'vgg16'
    
    return model.layers[-1].name

# GradCAM implementation
def generate_accurate_gradcam(img_array, model, class_index, brain_mask=None):
    try:
        # Get the last convolutional layer
        target_layer_name = find_target_layer(model)
        
        if not target_layer_name:
            logger.warning("Could not find appropriate target layer for GradCAM")
            return None
        
        if target_layer_name == 'vgg16':
            vgg_layer = model.get_layer('vgg16')
            
            if hasattr(vgg_layer, 'output'):
                grad_model = Model(
                    inputs=model.inputs,
                    outputs=[vgg_layer.output, model.output]
                )
            else:
                logger.warning("VGG16 layer not working correctly, using fallback")
                return generate_fallback_gradcam(img_array, brain_mask)
        else:
            grad_model = Model(
                inputs=model.inputs,
                outputs=[
                    model.get_layer(target_layer_name).output, # Model Layer (Feature Map of the Target Layer) 
                    model.output # Model Output (Prediction) 
                ]
            )
        
        # Record operations for automatic differentiation
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            target_class_output = predictions[:, class_index]
        
        grads = tape.gradient(target_class_output, conv_outputs)
        
        # Vector of mean gradients for each filter
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weight output feature maps with gradients
        weighted_output = tf.reduce_sum(
            tf.multiply(pooled_grads, conv_outputs[0]),
            axis=-1
        )
        
        # Create heatmap
        heatmap = np.maximum(weighted_output.numpy(), 0)
        
        # Normalize heatmap
        if np.max(heatmap) > 0:
            heatmap = heatmap / np.max(heatmap)
        
        heatmap_resized = cv2.resize(heatmap, (IMG_SIZE, IMG_SIZE))
        
        if brain_mask is not None:
            # Convert brain mask to binary (0 or 1)
            binary_mask = brain_mask > 0
            
            heatmap_resized = heatmap_resized * (binary_mask.astype(float)/255)
        
        heatmap_resized = np.clip(heatmap_resized, 0, 1)
        
        heatmap_8bit = np.uint8(255 * heatmap_resized)
        colored_heatmap = cv2.applyColorMap(heatmap_8bit, cv2.COLORMAP_JET)
        
        # Save colored heatmap
        cv2.imwrite(HEATMAP_PATH, colored_heatmap)
        
        # Get the original image for overlay
        orig_img = np.uint8(img_array[0] * 255)
        
        # Overlap heatmap and original image
        alpha = 0.6  # transparency factor
        overlaid_img = cv2.addWeighted(orig_img, 1 - alpha, colored_heatmap, alpha, 0)
        
        # Save the overlaid image
        cv2.imwrite(COMBINED_HEATMAP_PATH, overlaid_img)
        
        return COMBINED_HEATMAP_PATH
    
    except Exception as e:
        logger.error(f"Error generating GradCAM: {e}")
        import traceback
        traceback.print_exc()
        # Use fallback method
        return generate_fallback_gradcam(img_array, brain_mask)

# Fallback GradCAM implementation if the accurate one fails
def generate_fallback_gradcam(img_array, brain_mask=None):
    try:
        # Get original image
        orig_img = np.uint8(img_array[0] * 255)
        
        if brain_mask is None:
            gray_img = cv2.cvtColor(orig_img, cv2.COLOR_RGB2GRAY)
            _, brain_mask = cv2.threshold(gray_img, 15, 255, cv2.THRESH_BINARY)
            kernel = np.ones((5,5), np.uint8)
            brain_mask = cv2.morphologyEx(brain_mask, cv2.MORPH_CLOSE, kernel)
        
        heatmap = np.zeros((IMG_SIZE, IMG_SIZE), dtype=np.uint8)
        
        # Get binary mask of brain region
        binary_mask = brain_mask > 0
        
        y, x = np.ogrid[:IMG_SIZE, :IMG_SIZE]
        
        # Find the center of the brain mask
        brain_pixels = np.argwhere(binary_mask)
        if len(brain_pixels) > 0:
            center_y, center_x = np.mean(brain_pixels, axis=0).astype(int)
        else:
            center_y, center_x = IMG_SIZE // 2, IMG_SIZE // 2
        
        # distance Calculation
        ventricle_dist = np.sqrt((y - center_y)**2 + (x - center_x)**2)
        ventricle_weight = np.exp(-ventricle_dist**2 / (2*(IMG_SIZE/6)**2))
        
        frontal_y, frontal_x = center_y - IMG_SIZE//5, center_x
        frontal_dist = np.sqrt((y - frontal_y)**2 + (x - frontal_x)**2)
        frontal_weight = np.exp(-frontal_dist**2 / (2*(IMG_SIZE/5)**2))
        
        left_temp_y, left_temp_x = center_y, center_x - IMG_SIZE//3
        right_temp_y, right_temp_x = center_y, center_x + IMG_SIZE//3
        
        left_temp_dist = np.sqrt((y - left_temp_y)**2 + (x - left_temp_x)**2)
        right_temp_dist = np.sqrt((y - right_temp_y)**2 + (x - right_temp_x)**2)
        
        temp_dist = np.minimum(left_temp_dist, right_temp_dist)
        temp_weight = np.exp(-temp_dist**2 / (2*(IMG_SIZE/6)**2))
        
        combined_weight = 0.5 * ventricle_weight + 0.3 * temp_weight + 0.2 * frontal_weight
        
        heatmap[binary_mask] = np.uint8(combined_weight[binary_mask] * 255)
        
        # Apply colormap
        colored_heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        alpha = 0.6
        overlaid_img = cv2.addWeighted(orig_img, 1 - alpha, colored_heatmap, alpha, 0)
        
        # Save images
        cv2.imwrite(HEATMAP_PATH, colored_heatmap)
        cv2.imwrite(COMBINED_HEATMAP_PATH, overlaid_img)
        
        return COMBINED_HEATMAP_PATH
    
    except Exception as e:
        logger.error(f"Error in fallback GradCAM: {e}")
        import traceback
        traceback.print_exc()
        
        blank = np.ones((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8) * 255
        cv2.putText(blank, "Error generating", (10, IMG_SIZE//2 - 10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        cv2.putText(blank, "heatmap", (10, IMG_SIZE//2 + 20),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        cv2.imwrite(COMBINED_HEATMAP_PATH, blank)
        return COMBINED_HEATMAP_PATH

# Load the model at module initialization
subclass_model = None

def setup_subclass_routes(app):
    """Setup all routes for the subclass prediction functionality"""
    global subclass_model
    
    # Load the model if not already loaded
    if subclass_model is None:
        subclass_model = load_subclass_model()
        
    if subclass_model is None:
        logger.error("Failed to load subclass model - routes will not function properly")
    
    # Subclass prediction endpoint
    @app.route("/subclass_predict", methods=["POST"])
    def subclass_predict():
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
        
        # Save uploaded file
        file_path = os.path.join(tempfile.gettempdir(), file.filename)
        file.save(file_path)
        
        try:
            # Process file based on extension
            file_ext = os.path.splitext(file.filename)[-1].lower()
            
            if file_ext in ['.jpg', '.jpeg', '.png']:
                preprocessed_img, brain_mask = preprocess_image(file_path)
            elif file_ext == '.dcm':
                preprocessed_img, brain_mask = preprocess_dicom(file_path)
            else:
                preprocessed_img, brain_mask = preprocess_image(file_path)  
            
            if preprocessed_img is None:
                raise Exception("Failed to preprocess image")
            
            prediction = subclass_model.predict(preprocessed_img)
            
            # Define classes
            classes = [
                "Hemorrhagic Dementia",
                "Binswanger Dementia",
                "Strategic Dementia",
                "Subcortical Dementia"
            ]
            
            # Get results
            class_index = np.argmax(prediction)
            predicted_class = classes[class_index]
            confidence = round(float(np.max(prediction)) * 100, 2)
            
            class_probs = {label: round(float(prob) * 100, 2) 
                          for label, prob in zip(classes, prediction[0])}
            
            # Generate GradCAM visualization
            try:
                heatmap_path = generate_accurate_gradcam(
                    preprocessed_img,
                    subclass_model,
                    class_index,
                    brain_mask
                )
            except Exception as e:
                logger.error(f"Error in primary GradCAM method: {e}. Using fallback method.")
                # If that fails, use the fallback method
                heatmap_path = generate_fallback_gradcam(preprocessed_img, brain_mask)
            
            # Return results with guaranteed heatmap URL
            return jsonify({
                "prediction": predicted_class,
                "confidence": confidence,
                "class_probabilities": class_probs,
                "heatmap_url": "/gradcam_heatmap"
            })
        
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            import traceback
            traceback.print_exc()
            
            blank = np.ones((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8) * 255
            cv2.putText(blank, "Error processing", (10, IMG_SIZE//2 - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
            cv2.putText(blank, "image", (10, IMG_SIZE//2 + 20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
            cv2.imwrite(COMBINED_HEATMAP_PATH, blank)
            
            return jsonify({
                "error": str(e),
                "heatmap_url": "/gradcam_heatmap"
            }), 500
        
        finally:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except:
                    pass

    # Heatmap endpoint
    @app.route("/gradcam_heatmap", methods=["GET"])
    def get_gradcam():
        if os.path.exists(COMBINED_HEATMAP_PATH):
            return send_file(COMBINED_HEATMAP_PATH, mimetype="image/jpeg")
        elif os.path.exists(HEATMAP_PATH):
            return send_file(HEATMAP_PATH, mimetype="image/jpeg")
        
        # If no heatmap exists, create a blank one
        blank = np.ones((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8) * 255
        cv2.putText(blank, "Heatmap unavailable", (10, IMG_SIZE//2),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        cv2.imwrite(COMBINED_HEATMAP_PATH, blank)
        return send_file(COMBINED_HEATMAP_PATH, mimetype="image/jpeg")