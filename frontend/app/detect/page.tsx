"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function Detect() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);
    setConfidence(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence);
    } catch (error) {
      setError("Error making prediction. Please check API connections.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="max-w-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-primary text-center">Detect MRI Image</h1>
        <CardContent>
          <p className="mt-2 text-muted-foreground text-center">
            Upload an MRI scan to detect vascular dementia.
          </p>

          <div className="mt-4">
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="mt-4 flex justify-center">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : "Detect"}
            </Button>
          </div>

          {loading && (
            <div className="mt-4">
              <Progress value={50} />
              <Skeleton className="h-10 mt-2 w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {prediction && confidence !== null && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Detection Result:</h2>
              <p className="text-lg">{prediction}</p>
              <p className="text-gray-600">Confidence: {(confidence * 100).toFixed(2)}%</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
