"use client";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Users, Brain, BarChart3, Clock, AlertTriangle } from "lucide-react";

export default function FeaturesSection() {
  // Dementia prevalence data by age group from the chart
  const demographicData = [
    { ageGroup: '60-69', dementia: 3.2, alzheimers: 2.1, vascular: 0.8, other: 0.3 },
    { ageGroup: '70-79', dementia: 8.5, alzheimers: 6.2, vascular: 1.5, other: 0.8 },
    { ageGroup: '80-89', dementia: 14.2, alzheimers: 9.8, vascular: 2.8, other: 1.6 },
    { ageGroup: '≥90', dementia: 2.1, alzheimers: 1.4, vascular: 0.5, other: 0.2 },
    { ageGroup: 'All ages', dementia: 28.0, alzheimers: 19.5, vascular: 5.6, other: 2.9 }
  ];

  const keyInsights = [
    {
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      title: "Peak Incidence: 80-89 Years",
      description: "Highest dementia prevalence observed in the 80-89 age group with 14.2% total cases.",
      stat: "14.2%",
      color: "text-red-600"
    },
    {
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      title: "Vascular Dementia: 20% of Cases",
      description: "Vascular dementia represents 5.6% of total population, making it the second most common type.",
      stat: "5.6%",
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Early Detection Critical",
      description: "Significant increase from 3.2% (60-69) to 14.2% (80-89) highlights the importance of early screening.",
      stat: "340%",
      color: "text-green-600"
    }
  ];

  const maxValue = Math.max(...demographicData.map(d => d.dementia));

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 w-full">
      <div className="w-full">
        <div className="text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 mb-6"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">EPIDEMIOLOGICAL DATA</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Dementia <span className="text-red-600">Demographics</span> & Prevalence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto"
          >
            Age-stratified analysis reveals critical patterns in dementia prevalence, emphasizing the urgent need 
            for early detection and intervention strategies.
          </motion.p>
        </div>
        
        {/* Interactive Demographics Chart */}
        <div className="px-6 md:px-16 lg:px-24 mb-16">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Age-Specific Dementia Prevalence</h3>
              <p className="text-sm text-slate-600">Percentage distribution across different age groups</p>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-slate-700">Dementia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-slate-700">Alzheimer's disease</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-500 rounded"></div>
                <span className="text-slate-700">Vascular dementia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-slate-700">Other dementias</span>
              </div>
            </div>
            
            {/* Chart */}
            <div className="space-y-6">
              {demographicData.map((data, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                >
                  <div className="w-20 text-sm font-semibold text-slate-700 text-right">
                    {data.ageGroup}
                  </div>
                  
                  <div className="flex-1 relative h-12 bg-slate-100 rounded-lg overflow-hidden">
                    {/* Stacked bars */}
                    <motion.div 
                      className="absolute left-0 top-0 h-full bg-red-500 flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(data.dementia / maxValue) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                    >
                      <span className="text-white text-xs font-bold">{data.dementia}%</span>
                    </motion.div>
                    
                    <motion.div 
                      className="absolute left-0 top-1 h-10 bg-orange-500 rounded"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(data.alzheimers / maxValue) * 100}%` }}
                      transition={{ delay: 1.0 + i * 0.1, duration: 1 }}
                    />
                    
                    <motion.div 
                      className="absolute left-0 top-2 h-8 bg-teal-500 rounded"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(data.vascular / maxValue) * 100}%` }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 1 }}
                    />
                    
                    <motion.div 
                      className="absolute left-0 top-3 h-6 bg-purple-500 rounded"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(data.other / maxValue) * 100}%` }}
                      transition={{ delay: 1.4 + i * 0.1, duration: 1 }}
                    />
                  </div>
                  
                  <div className="w-16 text-sm text-slate-600">
                    Age group
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-8 px-6 md:px-16 lg:px-24 mb-12">
          {keyInsights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <Card className="h-full border-slate-200 hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
                      {insight.icon}
                    </div>
                    <div className={`text-2xl font-bold ${insight.color}`}>
                      {insight.stat}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-800">{insight.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{insight.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Clinical Implications */}
        <motion.div 
          className="px-6 md:px-16 lg:px-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-blue-900 to-teal-900 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Clinical Impact & Urgency</h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Understanding demographic patterns is crucial for healthcare planning and early intervention
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <Clock className="w-6 h-6" />, 
                  title: "Early Detection", 
                  value: "Critical",
                  desc: "Peak incidence in 80s highlights need for screening in 60s-70s"
                },
                { 
                  icon: <AlertTriangle className="w-6 h-6" />, 
                  title: "Vascular Dementia", 
                  value: "20%",
                  desc: "Second most common type, highly preventable with early intervention"
                },
                { 
                  icon: <Users className="w-6 h-6" />, 
                  title: "At-Risk Population", 
                  value: "55M+",
                  desc: "Estimated global population at risk based on age demographics"
                },
                { 
                  icon: <TrendingUp className="w-6 h-6" />, 
                  title: "Growth Rate", 
                  value: "15%/yr",
                  desc: "Annual increase in dementia cases globally due to aging population"
                }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-300">
                    {stat.icon}
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-blue-200 mb-2">{stat.title}</div>
                  <div className="text-xs text-blue-100 leading-relaxed">{stat.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}