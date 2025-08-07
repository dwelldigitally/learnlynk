import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: "Application Quality",
    metric: "+40%",
    description: "Increase in qualified applications through intelligent screening and automated workflows",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Users,
    title: "Student Retention",
    metric: "+89%",
    description: "Improvement in retention rates with personalized engagement and early intervention systems",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Target,
    title: "Enrollment Growth",
    metric: "+65%",
    description: "Streamlined admission processes leading to higher conversion rates and faster enrollment",
    color: "from-purple-500 to-pink-600"
  }
];

export const BenefitsSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
          Proven Results
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Successfully upgrade your enrollment{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            safely
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join hundreds of educational institutions that have transformed their student outcomes 
          with our comprehensive platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-2xl border border-border/50 p-8 h-full hover:border-primary/30 transition-all duration-300">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-5 rounded-2xl`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Metric */}
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                    {benefit.metric}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {benefit.description}
                  </p>

                  {/* Success Indicator */}
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Proven Success</span>
                  </div>
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