import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Users, Zap, Shield, Brain, Globe } from 'lucide-react';

interface BentoCardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ className, children, hover = true }) => (
  <motion.div
    className={cn(
      "relative overflow-hidden group",
      hover && "hover:scale-[1.02] transition-all duration-300",
      className
    )}
    whileHover={hover ? { y: -4 } : undefined}
  >
    <GlassCard className="h-full border border-border/20">
      {children}
    </GlassCard>
  </motion.div>
);

export const BentoGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
      {/* Main Hero Card */}
      <BentoCard className="md:col-span-2 lg:col-span-2 md:row-span-2">
        <div className="p-8 h-full flex flex-col justify-between min-h-[320px]">
          <div>
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <h3 className="text-2xl font-bold mb-3 leading-tight">
              Transform Student Recruitment with Intelligent Analytics
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Leverage machine learning to predict student success, optimize enrollment funnels, 
              and create personalized engagement journeys that convert prospects into enrolled students.
            </p>
          </div>
          <div className="flex items-center text-primary group cursor-pointer">
            <span className="font-medium">Explore AI Features</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </BentoCard>

      {/* Stats Card */}
      <BentoCard className="lg:col-span-1">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">45%</div>
          <div className="text-sm text-muted-foreground">Avg. Enrollment Increase</div>
        </div>
      </BentoCard>

      {/* Quick Feature */}
      <BentoCard className="lg:col-span-1">
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold mb-2">Student Journey Mapping</h4>
          <p className="text-sm text-muted-foreground">
            Track every touchpoint from prospect to graduation
          </p>
        </div>
      </BentoCard>

      {/* Performance Metrics */}
      <BentoCard className="md:col-span-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <Badge variant="outline" className="text-xs">Real-time</Badge>
          </div>
          <h4 className="font-semibold mb-2">Lightning Fast</h4>
          <p className="text-sm text-muted-foreground mb-3">
            99.9% uptime with sub-second response times
          </p>
          <div className="w-full bg-secondary rounded-full h-2">
            <motion.div 
              className="bg-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "99%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      </BentoCard>

      {/* Security Feature */}
      <BentoCard className="md:col-span-1">
        <div className="p-6">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h4 className="font-semibold mb-2">FERPA Compliant</h4>
          <p className="text-sm text-muted-foreground">
            Enterprise-grade security for student data protection
          </p>
        </div>
      </BentoCard>

      {/* Integration Showcase */}
      <BentoCard className="md:col-span-2 lg:col-span-2">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Seamless Integrations</h4>
              <p className="text-sm text-muted-foreground">Connect with 200+ education tools</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Salesforce', 'Canvas LMS', 'Banner ERP', 'Blackboard', 'Workday', 'PeopleSoft'].map((tool, index) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge variant="secondary" className="bg-background border">
                  {tool}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </BentoCard>
    </div>
  );
};