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
        <div className="p-8 h-full flex flex-col justify-between min-h-[320px] bg-gradient-to-br from-yellow-400/5 via-orange-400/5 to-teal-400/5">
          <div>
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-orange-700 dark:text-orange-300 border-orange-400/30">
              <Brain className="w-3 h-3 mr-1" />
              Smart Analytics
            </Badge>
            <h3 className="text-2xl font-bold mb-3 leading-tight">
              Easily track qualified applications and student journey
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Build a real community of prospective students with intelligent tracking, 
              personalized engagement workflows, and data-driven insights that convert interest into enrollment.
            </p>
          </div>
          <div className="flex items-center text-orange-600 dark:text-orange-400 group cursor-pointer">
            <span className="font-medium">Start Building Community</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </BentoCard>

      {/* Stats Card */}
      <BentoCard className="lg:col-span-1">
        <div className="p-6 text-center bg-gradient-to-br from-teal-400/10 to-blue-400/10">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">89%</div>
          <div className="text-sm text-muted-foreground font-medium">Student Success Rate</div>
        </div>
      </BentoCard>

      {/* Quick Feature */}
      <BentoCard className="lg:col-span-1">
        <div className="p-6 bg-gradient-to-br from-purple-400/10 to-pink-400/10">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold mb-2">Intelligent Student Matching</h4>
          <p className="text-sm text-muted-foreground">
            Smart algorithms match students to perfect programs and opportunities
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