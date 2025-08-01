import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, MessageSquare, Calendar, FileText, Shield, Zap, Target } from 'lucide-react';

const features = [
  {
    id: 'lead-management',
    title: 'Lead Management',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    description: 'Capture, track, and nurture leads through every stage of the enrollment journey.',
    highlights: ['Smart Lead Scoring', 'Automated Follow-ups', 'Multi-channel Tracking', 'Conversion Analytics'],
    image: '/src/assets/crm-dashboard.jpg'
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    icon: BarChart3,
    color: 'from-purple-500 to-purple-600',
    description: 'Get deep insights into enrollment trends, campaign performance, and student behavior.',
    highlights: ['Real-time Dashboards', 'Predictive Analytics', 'Custom Reports', 'ROI Tracking'],
    image: '/src/assets/education-analytics.jpg'
  },
  {
    id: 'communication',
    title: 'Communication Hub',
    icon: MessageSquare,
    color: 'from-green-500 to-green-600',
    description: 'Streamline all student communications with automated workflows and personalized messaging.',
    highlights: ['Email Automation', 'SMS Integration', 'Chat Support', 'Template Library'],
    image: '/src/assets/students-ai.jpg'
  },
  {
    id: 'scheduling',
    title: 'Smart Scheduling',
    icon: Calendar,
    color: 'from-orange-500 to-orange-600',
    description: 'Effortless appointment booking and event management for admissions teams.',
    highlights: ['Calendar Integration', 'Automated Reminders', 'Group Sessions', 'Time Zone Support'],
    image: '/src/assets/education-hero.jpg'
  }
];

export const InteractiveFeatures: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  return (
    <div className="space-y-12">
      {/* Feature Tabs */}
      <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="relative overflow-hidden group"
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{feature.title}</span>
                </motion.div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8 items-center"
              >
                {/* Feature Content */}
                <div className="space-y-6">
                  <div>
                    <motion.div
                      className={`inline-flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <feature.icon className="w-6 h-6" />
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </motion.div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-2 gap-3">
                    {feature.highlights.map((highlight, index) => (
                      <motion.div
                        key={highlight}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge variant="outline" className="w-full justify-start p-3 text-sm">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} mr-2`} />
                          {highlight}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Feature Image */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/80"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-20`} />
                </motion.div>
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>

      {/* Feature Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="relative overflow-hidden group cursor-pointer h-full">
                <CardContent className="p-6">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Hover Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  initial={false}
                  animate={{ 
                    opacity: hoveredCard === feature.id ? 0.05 : 0 
                  }}
                />
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};