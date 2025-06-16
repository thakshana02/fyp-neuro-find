"use client";
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload MRI Scan",
      description: "Simply upload the patient's MRI scan through our secure interface. We support all standard medical imaging formats."
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our advanced algorithms analyze the scan, identifying potential vascular abnormalities and patterns associated with dementia."
    },
    {
      number: "03",
      title: "Comprehensive Results",
      description: "Receive detailed classification results with confidence scores and visual heat maps highlighting areas of concern."
    }
  ];

  return (
    <section className="py-24 bg-blue-50 w-full">
      <div className="w-full">
        <div className="text-center mb-16 px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Our streamlined process makes advanced medical diagnostics accessible and efficient
          </motion.p>
        </div>
        
        <div className="relative px-6 md:px-16 lg:px-24">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className={`flex flex-col md:flex-row gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`md:w-1/2 flex ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                  <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 relative">
                    <div className="absolute top-6 -left-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold md:hidden">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center justify-center md:w-[60px]">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                </div>
                
                <div className="md:w-1/2 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}