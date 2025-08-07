import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Shield, 
  Zap,
  Star,
  Users
} from 'lucide-react';

const trustIndicators = [
  { icon: Shield, label: "FERPA Compliant", color: "text-blue-500" },
  { icon: Zap, label: "5-Minute Setup", color: "text-yellow-500" },
  { icon: CheckCircle, label: "No Credit Card", color: "text-green-500" },
  { icon: Users, label: "500+ Institutions", color: "text-purple-500" }
];

const features = [
  "✅ 30-day free trial with full access",
  "✅ Complete onboarding and training",
  "✅ Dedicated success manager",
  "✅ 24/7 expert support",
  "✅ Data migration assistance",
  "✅ ROI guarantee program"
];

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-500/30 px-4 py-2 text-sm font-medium">
            ✨ Ready to Transform Your Institution?
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Start your{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              educational revolution
            </span>
            {' '}today
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of institutions already improving their student outcomes 
            with our comprehensive platform. See results in your first month.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-xl shadow-primary/25 px-8 py-4 text-lg"
              onClick={() => navigate('/onboarding')}
            >
              Start Your Free 30-Day Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-border/50 hover:bg-accent/50 px-8 py-4 text-lg"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule a Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground mb-12">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-2"
                >
                  <Icon className={`w-4 h-4 ${indicator.color}`} />
                  <span>{indicator.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16"
        >
          {/* What You Get */}
          <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-2xl border border-border/50 p-8">
            <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              What You Get
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-muted-foreground"
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Guarantee */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Success Guarantee
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We're so confident in our platform that we guarantee measurable improvements 
              in your application quality and student retention within 90 days, or we'll 
              work with you until you see results.
            </p>
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <div className="text-green-700 font-medium text-sm">Average Results in First 90 Days:</div>
              <div className="text-green-600 text-xs mt-1">
                40% improvement in application quality • 89% increase in retention rates
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-muted-foreground mb-6">
            Still have questions? Our education specialists are here to help.
          </p>
          <Button 
            variant="outline"
            className="border-border/50 hover:bg-accent/50"
          >
            Talk to an Education Specialist
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};