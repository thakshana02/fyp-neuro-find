"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, LineChart, Activity, Target, CheckCircle, BarChart3, Zap, Settings } from "lucide-react";

export default function ClassificationSection() {
  // Binary Classification Data from the table
  const binaryResults = [
    { id: 'VGG16-1', accuracy: 96, loss: 0.0937, epochs: 50, batchSize: 16, lr: 0.0001, architecture: 'VGG16' },
    { id: 'VGG19', accuracy: 81, loss: 0.15, epochs: 50, batchSize: 32, lr: 0.01, architecture: 'VGG19' },
    { id: 'EfficientNet', accuracy: 93, loss: 0.2154, epochs: 50, batchSize: 32, lr: 0.0001, architecture: 'EfficientNetB0' }
  ];

  // Subclass Classification Data from the table
  const subclassResults = [
    { id: 'VGG16', accuracy: 86.39, loss: 0.3384, epochs: 50, batchSize: 32, lr: 0.0001, architecture: 'VGG16' },
    { id: 'VGG19', accuracy: 80.21, loss: 0.4293, epochs: 50, batchSize: 32, lr: 0.0001, architecture: 'VGG19' },
    { id: 'DenseNet', accuracy: 60.80, loss: 0.8011, epochs: 50, batchSize: 32, lr: 0.0001, architecture: 'DenseNet121' },
    { id: 'Ensemble', accuracy: 88.25, loss: 0, epochs: 0, batchSize: 0, lr: 0, architecture: 'Ensemble' }
  ];

  const architectures = ['VGG16', 'VGG19', 'EfficientNetB0', 'DenseNet121', 'Ensemble'];
  const architectureColors = {
    'VGG16': 'bg-blue-500',
    'VGG19': 'bg-indigo-500', 
    'EfficientNetB0': 'bg-purple-500',
    'DenseNet121': 'bg-pink-500',
    'Ensemble': 'bg-emerald-500'
  };

  return (
    <section className="py-16 bg-white w-full">
      <div className="w-full px-6 md:px-16 lg:px-24">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 mb-6"
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">HYPERPARAMETER OPTIMIZATION</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Advanced <span className="text-blue-600">Classification</span> System
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Comprehensive model evaluation across multiple architectures with optimized hyperparameters
          </motion.p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Binary Classification */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-blue-100 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Binary Classification</CardTitle>
                      <CardDescription className="text-sm">
                        Architecture performance comparison
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">96%</div>
                    <div className="text-xs text-slate-500">Best Result</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Architecture Performance Chart */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Model Accuracy Comparison</h4>
                  <div className="space-y-3">
                    {binaryResults.map((result, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded ${architectureColors[result.architecture]}`}></div>
                          <span className="text-sm font-medium text-slate-700">{result.architecture}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <motion.div 
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${result.accuracy}%` }}
                              transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-800 w-12">{result.accuracy}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hyperparameter Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">Best Configuration (VGG16)</h5>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">50</div>
                      <div className="text-slate-500">Epochs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">16</div>
                      <div className="text-slate-500">Batch Size</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">0.0001</div>
                      <div className="text-slate-500">Learn Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Subclass Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-indigo-100 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                      <LineChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Subclass Analysis</CardTitle>
                      <CardDescription className="text-sm">
                        Advanced subtype classification
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">88.3%</div>
                    <div className="text-xs text-slate-500">Ensemble</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Architecture Performance Chart */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-700 mb-4">Model Accuracy Comparison</h4>
                  <div className="space-y-3">
                    {subclassResults.map((result, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded ${architectureColors[result.architecture]}`}></div>
                          <span className="text-sm font-medium text-slate-700">{result.architecture}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-200 rounded-full h-2">
                            <motion.div 
                              className="bg-indigo-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${result.accuracy}%` }}
                              transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-800 w-16">{result.accuracy}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hyperparameter Details */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-slate-700 mb-3">Best Configuration (Ensemble)</h5>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="text-slate-600">Multi-model fusion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-indigo-500" />
                      <span className="text-slate-600">Optimized weights</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Performance Table */}
        <motion.div 
          className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Hyperparameter Optimization Results</h3>
            <p className="text-sm text-slate-600">Comprehensive architecture evaluation with loss comparison</p>
          </div>
          
          {/* Loss Comparison Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Training Loss vs Accuracy</h4>
            <div className="grid grid-cols-2 gap-8">
              {/* Binary Loss Chart */}
              <div>
                <h5 className="text-xs text-blue-600 font-semibold mb-2">Binary Classification</h5>
                <div className="space-y-2">
                  {binaryResults.slice(0, 4).map((result, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">{result.architecture}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded h-1">
                          <div 
                            className="bg-red-400 h-1 rounded"
                            style={{ width: `${Math.min(result.loss * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-12">{result.loss}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Subclass Loss Chart */}
              <div>
                <h5 className="text-xs text-indigo-600 font-semibold mb-2">Subclass Analysis</h5>
                <div className="space-y-2">
                  {subclassResults.slice(0, 4).map((result, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs text-slate-600">{result.architecture}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded h-1">
                          <div 
                            className="bg-red-400 h-1 rounded"
                            style={{ width: `${Math.min(result.loss * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-12">{result.loss}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="flex justify-center gap-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">5</div>
              <div className="text-xs text-slate-500">Architectures</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">15</div>
              <div className="text-xs text-slate-500">Configurations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">96%</div>
              <div className="text-xs text-slate-500">Best Binary</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">88.3%</div>
              <div className="text-xs text-slate-500">Best Subclass</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}