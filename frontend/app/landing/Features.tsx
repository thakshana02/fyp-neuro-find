"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BrainCircuit, BarChart4, ScanSearch, ShieldCheck } from "lucide-react";

export default function Features() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary">Why Choose Our AI-Powered Detection?</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover the key features that make our system innovative and effective.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 px-6">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <BrainCircuit className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">AI-Powered Diagnosis</h3>
              <p className="mt-2 text-muted-foreground">
                Advanced deep learning models provide accurate early detection of Vascular Dementia.
              </p>
            </Card>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 text-center">
              <ScanSearch className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">Fast & Efficient</h3>
              <p className="mt-2 text-muted-foreground">
                Get results in seconds with high-speed image analysis powered by AI.
              </p>
            </Card>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-6 text-center">
              <BarChart4 className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">Data-Driven Insights</h3>
              <p className="mt-2 text-muted-foreground">
                Gain valuable insights from AI-powered data analysis and risk predictions.
              </p>
            </Card>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="p-6 text-center">
              <ShieldCheck className="h-12 w-12 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold mt-4">Secure & Private</h3>
              <p className="mt-2 text-muted-foreground">
                Your data is handled with the highest security and privacy standards.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
