import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Zap, 
  Award, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Clock,
  Globe
} from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: "FERPA Compliant & Secure",
    description: "Enterprise-grade security with full FERPA compliance to protect sensitive student data",
    color: "text-blue-600"
  },
  {
    icon: Zap,
    title: "5-Minute Setup",
    description: "Get started immediately with our streamlined onboarding process and intuitive interface",
    color: "text-yellow-600"
  },
  {
    icon: Award,
    title: "Proven Success",
    description: "500+ institutions trust us with 40% average improvement in application quality",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Dedicated success team with education industry expertise available 24/7",
    color: "text-purple-600"
  },
  {
    icon: Globe,
    title: "Seamless Integration",
    description: "Works with 50+ existing education tools including Canvas, Blackboard, and more",
    color: "text-teal-600"
  },
  {
    icon: Clock,
    title: "Real-time Insights",
    description: "Make data-driven decisions with live dashboards and predictive analytics",
    color: "text-orange-600"
  }
];

const testimonials = [
  {
    quote: "We increased our qualified applications by 45% in just 6 months",
    author: "Dr. Sarah Johnson",
    role: "Director of Admissions",
    institution: "Metro State University"
  },
  {
    quote: "The automation saved us 20+ hours per week on manual tasks",
    author: "Michael Chen",
    role: "Student Services Manager",
    institution: "Tech College of Innovation"
  }
];

export const WhyChooseSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
          Why Choose Us
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why should you choose our{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            education tools
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built specifically for educational institutions with the features, security, 
          and support you need to succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* Reasons Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-xl border border-border/50 p-6 h-full hover:border-primary/30 transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-background/50 mb-4`}>
                      <Icon className={`w-5 h-5 ${reason.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">Success Stories</h3>
            
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-xl border border-border/50 p-6"
                >
                  <div className="flex items-start space-x-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <blockquote className="text-foreground font-medium leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  <div className="ml-7">
                    <div className="text-sm font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.institution}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg shadow-primary/25 w-full"
              >
                See All Success Stories
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};