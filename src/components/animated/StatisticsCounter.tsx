import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useAnimations';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, GraduationCap, Building } from 'lucide-react';

interface StatisticProps {
  icon: React.ComponentType<any>;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color: string;
  description: string;
}

const statistics: StatisticProps[] = [
  {
    icon: Building,
    value: 500,
    label: 'Universities',
    suffix: '+',
    color: 'from-blue-500 to-blue-600',
    description: 'Higher education institutions trust our platform'
  },
  {
    icon: Users,
    value: 2.5,
    label: 'Million Students',
    suffix: 'M',
    color: 'from-green-500 to-green-600',
    description: 'Students enrolled through our system'
  },
  {
    icon: TrendingUp,
    value: 40,
    label: 'Increase in Enrollment',
    suffix: '%',
    color: 'from-purple-500 to-purple-600',
    description: 'Average enrollment improvement'
  },
  {
    icon: GraduationCap,
    value: 98,
    label: 'Satisfaction Rate',
    suffix: '%',
    color: 'from-orange-500 to-orange-600',
    description: 'Customer satisfaction score'
  }
];

export const StatisticsCounter: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statistics.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <StatCard key={stat.label} stat={stat} index={index} />
        );
      })}
    </div>
  );
};

const StatCard: React.FC<{ stat: StatisticProps; index: number }> = ({ stat, index }) => {
  const IconComponent = stat.icon;
  const { count, ref } = useCountUp(stat.value, 2000, 0, stat.prefix, stat.suffix);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Card className="relative overflow-hidden h-full border-0 bg-card/50 backdrop-blur-sm">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        <CardContent className="p-6 relative">
          {/* Icon */}
          <motion.div
            className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>

          {/* Counter */}
          <div className="space-y-2">
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
              key={count} // Force re-render for smooth transitions
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {count}
            </motion.div>
            
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {stat.label}
            </h3>
            
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              {stat.description}
            </p>
          </div>

          {/* Hover indicator */}
          <motion.div
            className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color}`}
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};