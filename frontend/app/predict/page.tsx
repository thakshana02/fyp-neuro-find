"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { jsPDF } from "jspdf";
import { 
  FileUp, 
  AlertTriangle, 
  BrainCircuit, 
  FileDown, 
  BarChart2, 
  Camera,
  Info,
  Check,
  X,
  UploadCloud,
  ArrowRight,
  Loader2,
  ZoomIn
} from "lucide-react";

export default function Predict() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [rawScore, setRawScore] = useState<number | null>(null);
  const [subclassPrediction, setSubclassPrediction] = useState<string | null>(null);
  const [subclassConfidence, setSubclassConfidence] = useState<number | null>(null);
  const [gradcamBase64, setGradcamBase64] = useState<string | null>(null);
  const [gradcamUrl, setGradcamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validatingImage, setValidatingImage] = useState(false);
  const [isValidMri, setIsValidMri] = useState<boolean | null>(null);
  const [subclassLoading, setSubclassLoading] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subclassError, setSubclassError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showGradcamModal, setShowGradcamModal] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const allowedExtensions = ["png", "jpg", "jpeg", "dcm"];

  // Cleanup effect for objectURLs when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      if (gradcamUrl) {
        URL.revokeObjectURL(gradcamUrl);
      }
    };
  }, [filePreview, gradcamUrl]);

  // When modal closes, clean up the gradcam URL
  useEffect(() => {
    if (!showModal && gradcamUrl) {
      URL.revokeObjectURL(gradcamUrl);
      setGradcamUrl(null);
    }
  }, [showModal]);

  // Show results section when prediction is available
  useEffect(() => {
    if (prediction) {
      setShowResults(true);
    }
  }, [prediction]);

  useEffect(() => {
    if (gradcamBase64) {
      try {
        // Create a blob from the base64 string
        const byteCharacters = atob(gradcamBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        
        // Create object URL from the blob
        const url = URL.createObjectURL(blob);
        setGradcamUrl(url);
      } catch (error) {
        console.error("Error converting base64 to blob URL:", error);
      }
    }
  }, [gradcamBase64]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Please upload a ${allowedExtensions.join(", ")} file.`);
        setSelectedFile(null);
        setFilePreview(null);
        setIsValidMri(null);
        return;
      }

      // Clean up previous file preview
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      setSelectedFile(file);
      setError(null);
      setSubclassError(null);
      setSuccess(false);
      setPrediction(null);
      setConfidence(null);
      setRawScore(null);
      setSubclassPrediction(null);
      setSubclassConfidence(null);
      setGradcamBase64(null);
      setGradcamUrl(null);
      setIsValidMri(null); // Reset MRI validation state
      setShowResults(false);

      // Create preview for image files
      if (fileExtension !== 'dcm') {
        const preview = URL.createObjectURL(file);
        setFilePreview(preview);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Please upload a ${allowedExtensions.join(", ")} file.`);
        return;
      }

      // Clean up previous file preview
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      setSelectedFile(file);
      setError(null);
      setSubclassError(null);
      setSuccess(false);
      setPrediction(null);
      setConfidence(null);
      setRawScore(null);
      setSubclassPrediction(null);
      setSubclassConfidence(null);
      setGradcamBase64(null);
      setGradcamUrl(null);
      setIsValidMri(null);
      setShowResults(false);

      // Create preview for image files
      if (fileExtension !== 'dcm') {
        const preview = URL.createObjectURL(file);
        setFilePreview(preview);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setValidatingImage(true);
    setError(null);
    setPrediction(null);
    setConfidence(null);
    setRawScore(null);
    setSubclassPrediction(null);
    setSubclassConfidence(null);
    setGradcamBase64(null);
    setGradcamUrl(null);
    setSuccess(false);
    setIsValidMri(null);
    setShowResults(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error for non-MRI images
        if (data.is_valid_mri === false) {
          setIsValidMri(false);
          setError(data.error || "The uploaded image doesn't appear to be an MRI scan. Please upload a valid MRI image.");
          return;
        }
        throw new Error(data.error || "Server error");
      }

      setIsValidMri(true);
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setRawScore(data.raw_score || null);
      
      // Set Grad-CAM data if available
      if (data.gradcam_visualization) {
        setGradcamBase64(data.gradcam_visualization);
      }
      
      setSuccess(true);
      setShowResults(true);
    } catch (error) {
      console.error("API error:", error);
      if (!isValidMri) {
        setError("Provided FIle is not an MRI , Please provide a MRI image.");
      }
    } finally {
      setLoading(false);
      setValidatingImage(false);
    }
  };

  const handleFurtherAnalysis = async () => {
    if (!selectedFile) {
      setSubclassError("No file selected for further analysis.");
      return;
    }

    setShowModal(true);
    setSubclassLoading(true);
    setSubclassError(null);
    setGradcamUrl(null);

    try {
      // Handle the subclass prediction
      const formDataSubclass = new FormData();
      formDataSubclass.append("file", selectedFile);
      
      const subclassResponse = await fetch("http://127.0.0.1:5001/subclass_predict", {
        method: "POST",
        body: formDataSubclass,
      });

      if (!subclassResponse.ok) {
        throw new Error("Error getting subclass prediction");
      }
      
      const subclassData = await subclassResponse.json();
      setSubclassPrediction(subclassData.prediction);
      setSubclassConfidence(subclassData.confidence);

      //Handle the GradCAM visualization - using the same API with a different parameter
      const formDataGradcam = new FormData();
      formDataGradcam.append("file", selectedFile);
      formDataGradcam.append("generate_heatmap", "true");  
      
      // Using subclass_predict endpoint with heatmap param 
      const gradcamResponse = await fetch("http://127.0.0.1:5001/subclass_predict", {
        method: "POST",
        body: formDataGradcam,
      });

      if (!gradcamResponse.ok) {
        throw new Error("Error generating GradCAM visualization");
      }
      
      const gradcamData = await gradcamResponse.json();
      
    // Replace with this:
    if (gradcamData.heatmap_url) {
      // Construct the full URL by prepending the API base URL
      const fullHeatmapUrl = `http://127.0.0.1:5001${gradcamData.heatmap_url}`;
      setGradcamUrl(fullHeatmapUrl);
      
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      setGradcamUrl(`${fullHeatmapUrl}?t=${timestamp}`);
    } else {
      console.warn("No heatmap URL in response:", gradcamData);
    }
      
    } catch (error) {
      setSubclassError(`Error during further analysis: ${error.message}`);
      console.error("Further analysis error:", error);
    } finally {
      setSubclassLoading(false);
    }
  };

  const generateReport = async () => {
    setReportGenerating(true);
  
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Set document properties
      pdf.setProperties({
        title: "Vascular Dementia Analysis Report",
        subject: "AI-Assisted MRI Analysis",
        creator: "Neuro AI Platform"
      });
  
      // Add professional header
      pdf.setFillColor(36, 64, 98); 
      pdf.rect(0, 0, 210, 22, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("NEURO IMAGING CENTER", 105, 12, { align: "center" });
      pdf.setFontSize(10);
      pdf.text("Advanced MRI Analysis Platform", 105, 18, { align: "center" });
      
      // Add report title
      pdf.setFontSize(18);
      pdf.setTextColor(36, 64, 98);
      pdf.text("Vascular Dementia Analysis Report", 105, 35, { align: "center" });
      
      // Add report date
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 105, 43, { align: "center" });
      pdf.text(`Report ID: VD-${Math.floor(Math.random() * 10000)}`, 105, 48, { align: "center" });
      
      // Add primary analysis section (no background color)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(36, 64, 98);
      pdf.text("PRIMARY ANALYSIS", 20, 60);
      
      // Underline the section title
      pdf.setDrawColor(36, 64, 98);
      pdf.line(20, 62, 85, 62);
      
      // Add diagnosis result
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text("Diagnosis:", 20, 70);
      
      // Set color based on diagnosis
      if (isDementedCase) {
        pdf.setTextColor(180, 30, 30);
      } else {
        pdf.setTextColor(30, 120, 30);
      }
      
      pdf.setFont("helvetica", "bold");
      pdf.text(`${prediction || "Unknown"}`, 60, 70);
      
      // Set back to normal color
      pdf.setTextColor(60, 60, 60);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Confidence: ${confidence?.toFixed(2) || 0}%`, 20, 78);
      pdf.text(`Raw Score: ${rawScore?.toFixed(4) || "N/A"}`, 20, 86);
      
      // Add visualization section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(36, 64, 98);
      pdf.text("NEUROIMAGING WITH AI ANALYSIS", 20, 100);
      
      pdf.line(20, 102, 190, 102);
      
      let currentY = 115;
      let originalImageAdded = false;
      let gradcamImageAdded = false;
      
      // Try to add the original MRI image
      if (filePreview) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = filePreview;
          });
          
          const imgWidth = 70;
          const imgHeight = 70;
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          
          pdf.addImage(
            dataUrl,
            'JPEG',
            30,  // Centered in left half
            currentY,
            imgWidth,
            imgHeight
          );
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(80, 80, 80);
          pdf.text("Original MRI", 65, currentY + imgHeight + 5, { align: "center" });
          
          originalImageAdded = true;
        } catch (error) {
          console.error("Error adding original image:", error);
        }
      }
      
      // Try to add the GradCAM image from base64
      if (gradcamBase64) {
        try {
          const imgWidth = 70;
          const imgHeight = 70;
          
          pdf.addImage(
            'data:image/png;base64,' + gradcamBase64,
            'PNG',
            110,  // Centered in right half
            currentY,
            imgWidth,
            imgHeight
          );
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(80, 80, 80);
          pdf.text("GradCAM Analysis", 145, currentY + imgHeight + 5, { align: "center" });
          
          gradcamImageAdded = true;
        } catch (error) {
          console.error("Error adding GradCAM from base64:", error);
          
          // Try with URL as fallback
          if (gradcamUrl) {
            try {
              const response = await fetch(gradcamUrl);
              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);
              
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = objectUrl;
              });
              
              const imgWidth = 70;
              const imgHeight = 70;
              
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              
              const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
              
              pdf.addImage(
                dataUrl,
                'JPEG',
                110,  // Centered in right half
                currentY,
                imgWidth,
                imgHeight
              );
              
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(9);
              pdf.setTextColor(80, 80, 80);
              pdf.text("GradCAM Analysis", 145, currentY + imgHeight + 5, { align: "center" });
              
              URL.revokeObjectURL(objectUrl);
              gradcamImageAdded = true;
            } catch (urlError) {
              console.error("Error adding GradCAM from URL:", urlError);
            }
          }
        }
      }
      
      // If no images were added successfully, show a message
      if (!originalImageAdded && !gradcamImageAdded) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.setTextColor(180, 30, 30);
        pdf.text("Visualization images could not be included in this report.", 105, currentY + 30, { align: "center" });
        currentY += 60;
      } else {
        // Move down past the images
        currentY += 85;
      }
      
      // Add findings section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(36, 64, 98);
      pdf.text("FINDINGS:", 20, currentY);
      currentY += 8;
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      const findingsText = isDementedCase 
        ? "The MRI scan shows regions with abnormal vascular patterns consistent with vascular dementia. Multiple areas of hyperintensity are observed in the periventricular white matter, indicative of small vessel disease. GradCAM analysis highlights regions with significant influence on classification."
        : "The MRI scan shows no significant abnormalities consistent with vascular dementia. White matter appears intact with no evident periventricular hyperintensities or signs of small vessel disease.";
      
      const splitFindings = pdf.splitTextToSize(findingsText, 170);
      pdf.text(splitFindings, 25, currentY);
      currentY += splitFindings.length * 6 + 10;
      
      // Add impression section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(36, 64, 98);
      pdf.text("IMPRESSION:", 20, currentY);
      currentY += 8;
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      const impressionText = isDementedCase 
        ? "MRI findings are consistent with vascular dementia. Areas highlighted in the GradCAM visualization indicate regions most critical for this classification. Clinical correlation and neuropsychological evaluation are recommended."
        : "No imaging evidence of vascular dementia. Normal appearing brain tissue without significant vascular abnormalities.";
      
      const splitImpression = pdf.splitTextToSize(impressionText, 170);
      pdf.text(splitImpression, 25, currentY);
      
      // Add disclaimer in footer
      pdf.setDrawColor(100, 100, 100);
      pdf.line(20, 270, 190, 270);
      
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      const disclaimer = "DISCLAIMER: This is an AI-assisted analysis and should not replace professional medical evaluation. Please consult with a qualified healthcare provider for clinical interpretation of these results.";
      const splitDisclaimer = pdf.splitTextToSize(disclaimer, 170);
      pdf.text(splitDisclaimer, 20, 275);
      
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 282);
      pdf.text("Page 1/1", 190, 282, { align: "right" });
  
      // Save the PDF
      pdf.save(`vascular-dementia-report-${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      setError("Failed to generate report. Please try again.");
    } finally {
      setReportGenerating(false);
    }
  };
  
  // Heatmap color explanation data
  const heatmapColors = [
    { color: "rgb(255, 0, 0)", significance: "Highest influence", description: "Critical areas" },
    { color: "rgb(255, 165, 0)", significance: "High influence", description: "Important areas" },
    { color: "rgb(255, 255, 0)", significance: "Moderate influence", description: "Relevant areas" },
    { color: "rgb(0, 255, 255)", significance: "Low influence", description: "Less relevant" },
    { color: "rgb(0, 0, 255)", significance: "Minimal influence", description: "Background areas" }
  ];

  // Determine if the prediction is specifically for VAD-Demented (not Non-Demented)
  const isDementedCase = prediction && 
    (prediction.includes("VAD-Demented") || prediction === "Demented");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-40 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-3">
            MRI Analysis for Vascular Dementia
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform analyzes brain MRI scans to detect early signs of vascular dementia 
            with high precision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload and Analysis */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-lg border-blue-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  MRI Scan Analysis
                </h2>
                <p className="text-blue-100 text-sm">
                  Upload a brain MRI scan to analyze for vascular dementia indicators
                </p>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between mb-6">
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                      !showResults ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => setShowResults(false)}
                  >
                    Upload MRI
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                      showResults && prediction ? 'bg-blue-100 text-blue-700' : 'text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => prediction && setShowResults(true)}
                    disabled={!prediction}
                  >
                    Analysis Results
                  </button>
                </div>
                
                {!showResults && (
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div 
                      className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 p-3 rounded-full bg-blue-100 text-blue-600">
                          <UploadCloud className="h-8 w-8" />
                        </div>
                        <p className="text-center font-medium mb-2">
                          {selectedFile 
                            ? `Selected: ${selectedFile.name}` 
                            : "Drag & drop your MRI scan here"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4 text-center">
                          or click to browse from your device
                        </p>
                        <Input 
                          type="file" 
                          id="file-upload" 
                          accept=".png,.jpg,.jpeg,.dcm" 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="flex items-center"
                        >
                          <FileUp className="mr-2 h-4 w-4" />
                          Browse Files
                        </Button>
                        <p className="mt-4 text-xs text-gray-500 text-center flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          Supported formats: PNG, JPG, JPEG, DCM
                        </p>
                      </div>
                    </div>
                    
                    {/* Preview and Action Section */}
                    <div className={`grid ${filePreview ? 'grid-cols-2' : 'grid-cols-1'} gap-4 items-center`}>
                      {filePreview && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-2">Image Preview</p>
                          <div className="relative aspect-square max-h-60 overflow-hidden rounded-md shadow-inner bg-black/5">
                            <img 
                              src={filePreview} 
                              alt="MRI Preview" 
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2 truncate">
                            {selectedFile?.name}
                          </p>
                        </div>
                      )}
                      
                      <div className={`flex flex-col ${filePreview ? '' : 'items-center'}`}>
                        <Button 
                          onClick={handleSubmit} 
                          disabled={loading || !selectedFile}
                          className="w-full mb-3 bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {validatingImage ? "Validating MRI..." : "Analyzing..."}
                            </>
                          ) : (
                            <>
                              Analyze MRI Scan
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                        
                        {loading && (
                          <div className="w-full mt-2">
                            <Progress value={validatingImage ? 30 : 70} className="h-2" />
                            <p className="text-xs text-center mt-1 text-gray-500">
                              {validatingImage 
                                ? "Validating if image is a brain MRI..." 
                                : "Analyzing patterns in MRI scan..."}
                            </p>
                          </div>
                        )}
                        
                        {error && !isValidMri && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        
                        {isValidMri === false && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Invalid Image</AlertTitle>
                            <AlertDescription>
                              The uploaded image doesn't appear to be a brain MRI scan. Please upload a valid MRI image.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {showResults && prediction && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-lg ${
                      isDementedCase 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`px-3 py-1 text-xs font-medium rounded-full inline-flex ${
                            isDementedCase ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                          }`}>
                            {isDementedCase ? 'Vascular Dementia Detected' : 'No Dementia Detected'}
                          </div>
                          <h3 className="text-xl font-bold mt-2 text-gray-800">{prediction}</h3>
                        </div>
                        
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                          isDementedCase ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {isDementedCase ? <AlertTriangle size={28} /> : <Check size={28} />}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-500">Confidence</p>
                          <p className="text-xl font-bold">{confidence?.toFixed(2)}%</p>
                        </div>
                        
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-500">Raw Score</p>
                          <p className="text-xl font-bold">{rawScore?.toFixed(4) || "N/A"}</p>
                        </div>
                      </div>
                      
                      {/* Grad-CAM Visualization Section */}
                      {gradcamUrl && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-800">Grad-CAM Visualization</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowGradcamModal(true)}
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <ZoomIn className="mr-1 h-4 w-4" />
                              <span className="text-xs">Enlarge</span>
                            </Button>
                          </div>
                          
                          <div className="relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-2 rounded">
                                {filePreview && (
                                  <div className="aspect-square w-full overflow-hidden rounded">
                                    <img 
                                      src={filePreview} 
                                      alt="Original MRI" 
                                      className="w-full h-full object-contain"
                                    />
                                    <p className="text-xs text-center mt-1 text-gray-500">Original MRI</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="bg-gray-50 p-2 rounded">
                                <div className="aspect-square w-full overflow-hidden rounded">
                                  <img 
                                    src={gradcamUrl} 
                                    alt="Grad-CAM Visualization" 
                                    className="w-full h-full object-contain"
                                  />
                                  <p className="text-xs text-center mt-1 text-gray-500">Areas influencing prediction</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
                              <div className="flex items-start">
                                <Info className="h-4 w-4 mt-0.5 mr-2 text-blue-600 flex-shrink-0" />
                                
                                  <p>
                                  The red areas in the heatmap indicate regions that most influenced the model's prediction. 
                                  Brighter areas correspond to stronger influence on the classification decision.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Button 
                          onClick={generateReport} 
                          disabled={reportGenerating}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {reportGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileDown className="mr-2 h-4 w-4" />
                              Download Report
                            </>
                          )}
                        </Button>
                        
                        {isDementedCase && (
                          <Button 
                            onClick={handleFurtherAnalysis} 
                            variant="outline"
                            className="flex-1"
                          >
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Advanced Analysis
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Info Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full border-blue-100 shadow-lg">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Analysis Information
                </h2>
              </div>
              <CardContent className="p-6 space-y-6">
                {prediction ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
                      <p className="text-sm text-muted-foreground">
                        {isDementedCase 
                          ? "Our AI has detected patterns consistent with vascular dementia in the MRI scan."
                          : "Our AI did not detect patterns associated with vascular dementia in this MRI scan."}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-medium mb-2">What does this mean?</h4>
                      <p className="text-xs text-gray-600">
                        {isDementedCase 
                          ? "The analysis indicates vascular changes in the brain that may be consistent with vascular dementia. This is an AI-assisted analysis and should be confirmed by a healthcare professional."
                          : "The analysis did not detect significant vascular changes associated with vascular dementia. Regular follow-ups are still recommended for patients with cognitive concerns."}
                      </p>
                    </div>
                    
                    {gradcamUrl && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-medium mb-2">About the Visualization</h4>
                        <p className="text-xs text-gray-600">
                          The Grad-CAM visualization highlights regions of the MRI that influenced the AI's decision. 
                          Red areas had the strongest influence on the prediction, helping provide insight into which 
                          brain regions were most relevant to the classification.
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                      <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-[10px]">1</span>
                          </div>
                          <span>Download the detailed report for your records</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-[10px]">2</span>
                          </div>
                          <span>Share the results with the patient's healthcare provider</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-[10px]">3</span>
                          </div>
                          <span>Consider additional clinical assessments as appropriate</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About This Tool</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI-powered analysis tool examines MRI scans to detect vascular changes in the brain
                        that may indicate vascular dementia.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-3 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Camera className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Upload MRI</h4>
                          <p className="text-xs text-gray-600">
                            Upload a brain MRI scan in PNG, JPG, JPEG, or DICOM format
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-3 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">AI Analysis</h4>
                          <p className="text-xs text-gray-600">
                            Our advanced AI algorithms analyze the scan for vascular dementia indicators
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-3 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <BarChart2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Get Results</h4>
                          <p className="text-xs text-gray-600">
                            Receive detailed analysis with confidence scores and visualization
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                        Important Note
                      </h4>
                      <p className="text-xs text-gray-600">
                        This tool is designed to assist healthcare professionals and is not a replacement for clinical diagnosis. Results should be interpreted by qualified medical personnel.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Further Analysis Dialog */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogTitle className="flex items-center text-xl font-bold text-primary">
              <BarChart2 className="mr-2 h-5 w-5" />
              Advanced Dementia Analysis
            </DialogTitle>
              
            {subclassLoading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <p className="text-center font-medium text-primary">Analyzing dementia subtype...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take a moment as we process the scan in detail.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {subclassError && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{subclassError}</AlertDescription>
                  </Alert>
                )}
                
                {subclassPrediction && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">Detailed Classification:</h3>
                        <p className="text-xl font-bold text-blue-700 mt-1">{subclassPrediction}</p>
                        {subclassConfidence && (
                          <div className="mt-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full inline-block">
                            Confidence: {subclassConfidence.toFixed(2)}%
                          </div>
                        )}
                      </div>
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <BrainCircuit className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Analysis Visualization</h3>
                  <p className="text-sm text-muted-foreground">
                    The heatmap highlights regions in the brain that influenced the AI's classification decision.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Original Image - Left */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
                      <h4 className="text-sm font-medium mb-3 text-center">Original MRI Scan</h4>
                      <div className="flex justify-center flex-grow">
                        {filePreview ? (
                          <div className="relative w-full aspect-square bg-black/5 rounded-md overflow-hidden">
                            <img
                              src={filePreview}
                              alt="Original MRI Scan"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md">
                            <p className="text-gray-500 text-sm">Image not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* GradCAM - Center */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
                      <h4 className="text-sm font-medium mb-3 text-center">GradCAM Visualization</h4>
                      <div className="flex justify-center flex-grow">
                        {gradcamUrl ? (
                          <div className="relative w-full aspect-square bg-black/5 rounded-md overflow-hidden">
                            <img
                              src={gradcamUrl}
                              alt="GradCAM Heatmap"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-square bg-gray-200 flex items-center justify-center rounded-md">
                            <p className="text-gray-500 text-sm">Heatmap not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Heatmap Color Explanation - Right */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
                      <h4 className="text-sm font-medium mb-3 text-center">Heatmap Interpretation</h4>
                      <div className="space-y-3 flex-grow">
                        <p className="text-xs text-gray-600">
                          The heatmap shows areas that influenced the model's prediction:
                        </p>
                        <div className="space-y-2">
                          {heatmapColors.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div 
                                className="w-4 h-4 mr-2 rounded-sm flex-shrink-0" 
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <div>
                                <p className="text-xs font-medium">{item.significance}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-blue-600" />
                      Interpretation Guide
                    </h4>
                    <p className="text-sm text-gray-600">
                      Brighter areas (red/yellow) on the heatmap indicate regions most critical for the diagnosis 
                      of {subclassPrediction || prediction}. These regions showed patterns that the AI detected as 
                      significant for vascular dementia classification.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                  <Button 
                    onClick={generateReport} 
                    disabled={reportGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {reportGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Report
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Grad-CAM Modal for enlarged view */}
        <Dialog open={showGradcamModal} onOpenChange={setShowGradcamModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogTitle className="flex items-center text-xl font-bold text-primary">
              <Camera className="mr-2 h-5 w-5" />
              Grad-CAM Visualization
            </DialogTitle>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-3 text-center">Original MRI</h3>
                  <div className="flex justify-center">
                    {filePreview ? (
                      <div className="max-h-80 overflow-hidden rounded-md">
                        <img
                          src={filePreview}
                          alt="Original MRI Scan"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded-md">
                        <p className="text-gray-500">Image not available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Grad-CAM Visualization */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium mb-3 text-center">Grad-CAM Heat Map</h3>
                  <div className="flex justify-center">
                    {gradcamUrl ? (
                      <div className="max-h-80 overflow-hidden rounded-md">
                        <img
                          src={gradcamUrl}
                          alt="Grad-CAM Visualization"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded-md">
                        <p className="text-gray-500">Visualization not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Heatmap Explanation */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium mb-3">Understanding the Visualization</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Grad-CAM (Gradient-weighted Class Activation Mapping) is an explainable AI technique that 
                  highlights regions in the image that influenced the model's decision. The visualization helps 
                  understand which parts of the brain MRI were most important for the AI's classification.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {heatmapColors.map((item, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-gray-200">
                      <div 
                        className="w-full h-4 mb-1 rounded-sm" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <p className="text-xs font-medium">{item.significance}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 mt-4 italic">
                  Note: This visualization is meant to provide insight into the model's decision-making process 
                  and should be interpreted by healthcare professionals in conjunction with other clinical data.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowGradcamModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}