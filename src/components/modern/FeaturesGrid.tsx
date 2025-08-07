import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Brain, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const features = [
  {
    title: "Easily track qualified applications and student journey",
    description: "Monitor every step of the student application process with intelligent tracking and automated workflows",
    icon: FileText,
    size: "large",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    title: "Smart Student Matching",
    description: "AI-powered matching system that connects students with the perfect programs",
    icon: Brain,
    size: "medium",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Real-time Analytics",
    description: "Track performance metrics and student success indicators in real-time",
    icon: BarChart3,
    size: "medium",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    title: "Automated Communication",
    description: "Personalized messaging that engages students at the right time",
    icon: MessageSquare,
    size: "medium",
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Student Community Hub",
    description: "Build stronger connections and improve retention through community engagement",
    icon: Users,
    size: "medium",
    gradient: "from-teal-500 to-blue-600"
  },
  {
    title: "Targeted Outreach",
    description: "Reach the right students with precision targeting and campaign management",
    icon: Target,
    size: "medium",
    gradient: "from-indigo-500 to-purple-600"
  }
];

export const FeaturesGrid: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
          Powerful Features
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Everything you need to{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            succeed
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive tools designed specifically for educational institutions to manage 
          student applications, improve retention, and drive enrollment growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isLarge = feature.size === "large";
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className={`relative bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-2xl border border-border/50 p-6 h-full hover:border-primary/30 transition-all duration-300 ${isLarge ? 'md:p-8' : ''}`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-2xl`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className={`font-semibold mb-3 text-foreground ${isLarge ? 'text-2xl' : 'text-lg'}`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-muted-foreground leading-relaxed mb-4 ${isLarge ? 'text-lg' : ''}`}>
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className={`flex items-center space-x-2 text-sm bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent font-medium group-hover:translate-x-1 transition-transform duration-200`}>
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Sparkles for large card */}
                  {isLarge && (
                    <div className="absolute top-4 right-4">
                      <Sparkles className={`w-6 h-6 bg-gradient-to-r ${feature.gradient} opacity-60`} />
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};