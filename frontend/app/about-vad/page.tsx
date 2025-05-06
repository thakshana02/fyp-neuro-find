"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function AboutVAD() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-40">
      <div className="w-full max-w-4xl mb-8 text-left">
        <h1 className="text-3xl font-bold mb-6 text-center"></h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">GitHub Installation Guide</h2>
          
          <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Node.js (v16+)</li>
            <li>Python (v3.8+)</li>
            <li>Git</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-2">Step 1: Clone the Repository</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            git clone https://github.com/thakshana/VadDetection.git<br />
            cd projectFYP
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Step 2: Setup Frontend (Next.js)</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            cd frontend<br />
            npm install<br />
            npm run dev
          </div>
          <p className="mb-4">
            The frontend will start running at <code>http://localhost:3000</code>
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Step 3: Setup Backend (Flask)</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            cd ../script<br />
            python -m venv venv<br />
            <span className="text-gray-500"># On Windows</span><br />
            venv\Scripts\activate<br />
            <span className="text-gray-500"># On macOS/Linux</span><br />
            source venv/bin/activate<br />
            <br />
            pip install -r requirements.txt
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Step 4: Run Flask Servers</h3>
          <p className="mb-2">Start the binary model server:</p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            python app.py
          </div>
          <p className="mb-2">In a separate terminal, start the subclass model server:</p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            python subclass.py
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Dependencies</h3>
          <p className="mb-2">Backend dependencies (create a requirements.txt with these):</p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            flask==2.0.1<br />
            flask-cors==3.0.10<br />
            tensorflow==2.9.0<br />
            numpy==1.22.3<br />
            pillow==9.0.1<br />
            opencv-python==4.5.5.64
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Project Structure</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            projectFYP/<br />
            ├── frontend/ (Next.js app)<br />
            │   ├── components/<br />
            │   ├── app/<br />
            │   └── ...<br />
            └── script/<br />
                ├── binary_epoch50.h5<br />
                ├── VGG16.h5<br />
                ├── app.py<br />
                └── subclass.py
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">Setting Up GitHub Repo</h3>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4">
            # Create .gitignore file<br />
            echo "node_modules/<br />
            .next/<br />
            venv/<br />
            __pycache__/<br />
            *.pyc<br />
            .env<br />
            .env.local" > .gitignore<br />
            <br />
            # Initialize repo (if not cloned)<br />
            git init<br />
            git add .<br />
            git commit -m "Initial commit"<br />
            <br />
            # Connect to GitHub<br />
            git remote add origin https://github.com/yourusername/projectFYP.git<br />
            git push -u origin main
          </div>

        </div>
      </div>
    </div>
  );
}