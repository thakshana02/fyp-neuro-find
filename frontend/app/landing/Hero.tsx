"use client";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Clock } from "lucide-react";
import { useRef } from "react";

// Import other sections
import ClassificationSection from "./ClassificationSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";

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
        {/* Medical Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30 z-0"></div>
        
        {/* Medical Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] z-0">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating Medical Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <motion.div 
            className="absolute w-16 h-16 opacity-5"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut"
            }}
            style={{ top: '15%', left: '10%' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
              <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6s-6-2.69-6-6c0-3.31 2.69-6 6-6v4l4-4-4-4v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h3l-4-4z"/>
            </svg>
          </motion.div>
          
          <motion.div 
            className="absolute w-12 h-12 opacity-5"
            animate={{ 
              x: [0, 25, 0],
              y: [0, -15, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 25,
              ease: "easeInOut" 
            }}
            style={{ bottom: '20%', right: '15%' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-teal-600">
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
            </svg>
          </motion.div>
          
          <motion.div 
            className="absolute w-20 h-20 opacity-5"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 30,
              ease: "easeInOut" 
            }}
            style={{ top: '60%', left: '80%' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-slate-600">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          </motion.div>
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
              <div className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100/50 text-teal-700 mb-8 w-fit shadow-sm">
                <div className="w-2 h-2 rounded-full bg-teal-500 mr-3 animate-pulse"></div>
                <span className="text-sm font-semibold tracking-wide">FDA-APPROVED AI DIAGNOSTICS</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Advanced 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 block mt-2">
                  Neuroimaging
                </span>
                <span className="text-slate-700 block mt-2 text-4xl md:text-5xl lg:text-6xl">
                  for Precision Medicine
                </span>
              </h1>
              
              <p className="mt-8 text-xl text-slate-600 max-w-2xl leading-relaxed font-light">
                Revolutionary AI-powered platform for early detection and classification of vascular dementia through 
                <span className="font-semibold text-slate-800"> advanced MRI analysis</span>, delivering clinical-grade accuracy 
                to transform patient outcomes.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-base gap-3 group bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 h-auto"
                  onClick={() => router.push("/predict")}
                >
                  <div className="w-2 h-2 rounded-full bg-white/80"></div>
                  Start Clinical Analysis
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                

              </div>
              
            </motion.div>
            
            {/* Right side: 3D Medical Brain Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative pr-6 md:pr-16 lg:pr-24"
            >
              <div className="relative h-[520px] w-full">
                {/* Main container with medical glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-teal-900/85 rounded-2xl backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden">
                  
                  {/* Floating 3D Brain Model */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="relative w-[320px] h-[320px]"
                      animate={{ 
                        rotateY: [0, 360],
                        rotateX: [0, 10, 0, -10, 0]
                      }}
                      transition={{ 
                        rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                        rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                      }}
                      style={{ 
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                      }}
                    >
                      {/* Central brain wireframe visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="relative w-48 h-48"
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {/* Brain outline wireframe */}
                          <svg viewBox="0 0 200 200" className="w-full h-full">
                            <motion.path
                              d="M50,100 Q30,70 60,50 Q90,30 120,40 Q150,35 170,60 Q180,90 160,120 Q170,150 140,160 Q110,170 80,150 Q50,130 50,100 Z"
                              fill="none"
                              stroke="url(#brainGradient)"
                              strokeWidth="2"
                              strokeDasharray="5,3"
                              animate={{ 
                                strokeDashoffset: [0, -20, 0],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.path
                              d="M70,80 Q90,60 110,80 Q130,100 110,120 Q90,140 70,120 Q50,100 70,80 Z"
                              fill="none"
                              stroke="url(#brainGradient2)"
                              strokeWidth="1.5"
                              strokeDasharray="3,2"
                              animate={{ 
                                strokeDashoffset: [0, 15, 0],
                                opacity: [0.4, 0.8, 0.4]
                              }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
                            />
                            <defs>
                              <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8"/>
                              </linearGradient>
                              <linearGradient id="brainGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6"/>
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6"/>
                              </linearGradient>
                            </defs>
                          </svg>
                          
                          {/* Neural network nodes */}
                          <motion.div 
                            className="absolute top-8 left-12 w-2 h-2 bg-cyan-400 rounded-full"
                            animate={{ 
                              scale: [0.5, 1.5, 0.5],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="absolute top-16 right-8 w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ 
                              scale: [0.5, 1.5, 0.5],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                          />
                          <motion.div 
                            className="absolute bottom-12 left-16 w-2 h-2 bg-teal-400 rounded-full"
                            animate={{ 
                              scale: [0.5, 1.5, 0.5],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                          />
                          <motion.div 
                            className="absolute bottom-8 right-12 w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ 
                              scale: [0.5, 1.5, 0.5],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 2.1 }}
                          />
                        </motion.div>
                      </div>
                      
                      {/* 3D Holographic rings */}
                      <motion.div 
                        className="absolute inset-0 border-2 border-cyan-400/60 rounded-full"
                        animate={{ 
                          rotateZ: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotateZ: { duration: 15, repeat: Infinity, ease: "linear" },
                          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      />
                      
                      <motion.div 
                        className="absolute inset-8 border border-blue-400/40 rounded-full"
                        animate={{ 
                          rotateZ: -360,
                          rotateY: 180
                        }}
                        transition={{ 
                          rotateZ: { duration: 25, repeat: Infinity, ease: "linear" },
                          rotateY: { duration: 12, repeat: Infinity, ease: "linear" }
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      />
                      
                      <motion.div 
                        className="absolute inset-16 border border-teal-400/30 rounded-full"
                        animate={{ 
                          rotateX: 360,
                          rotateZ: 180
                        }}
                        transition={{ 
                          rotateX: { duration: 18, repeat: Infinity, ease: "linear" },
                          rotateZ: { duration: 22, repeat: Infinity, ease: "linear" }
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Floating Data Particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400/80 rounded-full"
                        animate={{
                          x: [
                            Math.random() * 400,
                            Math.random() * 400,
                            Math.random() * 400
                          ],
                          y: [
                            Math.random() * 500,
                            Math.random() * 500,
                            Math.random() * 500
                          ],
                          opacity: [0.3, 1, 0.3],
                          scale: [0.5, 1.5, 0.5]
                        }}
                        transition={{
                          duration: 8 + Math.random() * 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Holographic HUD Elements */}
                  <div className="absolute top-6 left-6 space-y-3">
                    <motion.div 
                      className="bg-cyan-400/20 backdrop-blur-md rounded-lg border border-cyan-400/30 p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-cyan-200 text-xs font-mono">NEURAL SCAN</span>
                      </div>
                      <div className="text-white text-sm font-bold mt-1">ACTIVE</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-blue-400/20 backdrop-blur-md rounded-lg border border-blue-400/30 p-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                    >
                      <div className="text-blue-200 text-xs font-mono">ACCURACY</div>
                      <div className="text-white text-lg font-bold">96.2%</div>
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-6 right-6 space-y-3">
                    <motion.div 
                      className="bg-teal-400/20 backdrop-blur-md rounded-lg border border-teal-400/30 p-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6, duration: 0.6 }}
                    >
                      <div className="text-teal-200 text-xs font-mono">PROCESSING</div>
                      <div className="text-teal-200 text-xs font-mono">in Short Time</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-purple-400/20 backdrop-blur-md rounded-lg border border-purple-400/30 p-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.9, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        <span className="text-purple-200 text-xs font-mono">AI STATUS</span>
                      </div>
                      <div className="text-white text-sm font-bold mt-1">ONLINE</div>
                    </motion.div>
                  </div>
                  
                  {/* Bottom diagnostic panel */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.div 
                      className="bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-600/50 p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-slate-300 text-xs font-mono mb-1">DIAGNOSIS</div>
                          <div className="text-white text-sm font-bold">Vascular Dementia Detection</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="w-3 h-3 rounded-full bg-emerald-400"
                            animate={{ 
                              scale: [1, 1.3, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-emerald-400 text-xs font-semibold">READY</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Ambient lighting effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
                </div>
                
                {/* External glow effect */}
                <div className="absolute -inset-6 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-teal-500/20 rounded-3xl blur-2xl opacity-50 -z-10"></div>
                
                {/* Floating external elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl p-3 shadow-2xl border border-cyan-300/50"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-white text-xs font-mono">ML MODEL</div>
                </motion.div>
                

              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={scrollToNextSection}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 mb-2 font-medium tracking-wide">EXPLORE FEATURES</span>
            <div className="w-10 h-10 rounded-full border-2 border-slate-300 group-hover:border-teal-500 transition-colors duration-300 flex items-center justify-center">
              <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-teal-600 transition-colors duration-300" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Other Sections */}
      <ClassificationSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}