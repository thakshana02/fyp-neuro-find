"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Upload, Brain, CheckCircle2 } from "lucide-react";

export default function Works() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary">How It Works</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Follow these three simple steps to get an AI-powered diagnosis.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 px-6">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 text-center shadow-md border">
              <Upload className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">Upload MRI Scan</h3>
              <p className="mt-2 text-muted-foreground">
                Choose an MRI scan image and upload it for analysis.
              </p>
            </Card>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 text-center shadow-md border">
              <Brain className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">AI Analyzes Image</h3>
              <p className="mt-2 text-muted-foreground">
                Our deep learning model processes and predicts the condition.
              </p>
            </Card>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 text-center shadow-md border">
              <CheckCircle2 className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">Get Your Results</h3>
              <p className="mt-2 text-muted-foreground">
                Instantly receive the prediction result and confidence score.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
