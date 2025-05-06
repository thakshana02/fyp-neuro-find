"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Brain, ChevronDown, Clock, Eye, LineChart, Shield, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section ref={scrollRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-background z-0"></div>
        
        {/* Animated circles in background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.div 
            className="absolute rounded-full w-[500px] h-[500px] bg-blue-100/30 blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div 
            className="absolute rounded-full w-[300px] h-[300px] bg-indigo-100/30 blur-3xl"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut" 
            }}
            style={{ bottom: '15%', right: '15%' }}
          />
        </div>

        <div className="w-full max-w-none z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            {/* Left side:*/}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center pl-6 md:pl-16 lg:pl-24"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 mb-6 w-fit">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Early Detection System</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                Transforming Healthcare with 
                <span className="text-blue-600 block mt-2">AI & Medical Imaging</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Our advanced AI platform provides early detection of Vascular Dementia through precision 
                MRI scan analysis, empowering healthcare professionals with accurate diagnostics.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-base gap-2 group"
                  onClick={() => router.push("/predict")}
                >
                  Start Prediction
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-base" 
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center mt-10 gap-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary"></span> healthcare professionals trust our solution
                </p>
              </div>
            </motion.div>
            
            {/* Right side: illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative pr-6 md:pr-16 lg:pr-24"
            >
              <div className="relative h-[450px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 to-indigo-100/40 rounded-3xl backdrop-blur-sm border border-blue-100/50 shadow-xl overflow-hidden">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-200/50 rounded-full blur-2xl"></div>
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-2xl"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[300px] h-[300px]">
                    <Image 
                      src="/logo.png" 
                      alt="AI Medical Imaging" 
                      width={400} 
                      height={400}
                      className="object-contain"
                    />
                    
                    {/* Animated orbit */}
                    <motion.div 
                      className="absolute inset-0 border-2 border-dashed border-blue-300/50 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.div 
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={scrollToNextSection}
        >
          <ChevronDown className="w-10 h-10 text-blue-600" />
        </motion.div>
      </section>

      {/* Classification Section */}
      <section className="py-24 bg-white w-full">
        <div className="w-full">
          <div className="text-center mb-16 px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-primary mb-4"
            >
              Advanced Classification System
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Our dual classification approach provides comprehensive analysis for accurate vascular dementia detection
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 px-6 md:px-16 lg:px-24">
            {/* Binary Classification */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full overflow-hidden border-blue-100 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-8">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Binary Classification</CardTitle>
                  <CardDescription className="text-base">
                    Detect the presence or absence of vascular dementia with high accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <ul className="space-y-4">
                    {[
                      "96% detection accuracy on validated datasets",
                      "Real-time analysis of MRI scans",
                      "Clear positive/negative determination",
                      "Confidence scoring for each prediction"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <span className="text-blue-600 text-xs font-bold">{i+1}</span>
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy Rating</p>
                        <p className="text-xl font-bold text-primary">96%</p>
                      </div>
                      <div className="w-16 h-16">
                        <div className="w-full h-full rounded-full border-4 border-blue-100 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">A+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Subclass Classification */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full overflow-hidden border-indigo-100 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-8">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <LineChart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Subclass Analysis</CardTitle>
                  <CardDescription className="text-base">
                    Detailed classification of vascular dementia subtypes for targeted treatment
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <ul className="space-y-4">
                    {[
                      "Identification of 4 distinct vascular dementia subtypes",
                      "Severity assessment on a progressive scale",
                      "Region-specific analysis of affected brain areas",
                      "Personalized treatment path recommendations"
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <span className="text-indigo-600 text-xs font-bold">{i+1}</span>
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-indigo-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Subtype Accuracy</p>
                        <p className="text-xl font-bold text-primary">88.25%</p>
                      </div>
                      <div className="w-16 h-16">
                        <div className="w-full h-full rounded-full border-4 border-indigo-100 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50 w-full">
        <div className="w-full">
          <div className="text-center mb-16 px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-primary mb-4"
            >
              Cutting-Edge Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Our platform combines advanced AI technology with medical expertise to provide comprehensive vascular dementia detection
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 px-6 md:px-16 lg:px-24">
            {[
              {
                icon: <Eye className="w-6 h-6 text-blue-600" />,
                title: "Enhanced Visualization",
                description: "Advanced imaging techniques that highlight vascular abnormalities with precision and clarity."
              },
              {
                icon: <Shield className="w-6 h-6 text-blue-600" />,
                title: "HIPAA Compliant",
                description: "Enterprise-grade security ensures patient data protection and regulatory compliance."
              },
              {
                icon: <Wand2 className="w-6 h-6 text-blue-600" />,
                title: "AI-Powered Analysis",
                description: "Deep learning algorithms trained on extensive datasets for reliable detection."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Card className="h-full border-blue-100 hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
              {[
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

              ].map((step, i) => (
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
    </main>
  );
}