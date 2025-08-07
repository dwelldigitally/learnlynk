import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Award, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const communityFeatures = [
  {
    icon: Users,
    title: "Student Engagement Hub",
    description: "Create meaningful connections between students, faculty, and alumni",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: MessageCircle,
    title: "Peer Support Networks",
    description: "Foster collaborative learning environments and study groups",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Calendar,
    title: "Event & Activity Management",
    description: "Organize campus events, workshops, and student activities seamlessly",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Award,
    title: "Achievement Recognition",
    description: "Celebrate student milestones and academic achievements",
    color: "from-orange-500 to-red-600"
  }
];

const stats = [
  { number: "89%", label: "Student Retention", icon: TrendingUp },
  { number: "92%", label: "Community Engagement", icon: Heart },
  { number: "76%", label: "Peer Collaboration", icon: Users },
  { number: "85%", label: "Event Participation", icon: Calendar }
];

export const CommunitySection: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
          Community Building
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Build a real community and{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            student success agenda
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create thriving educational communities that foster student engagement, 
          collaboration, and long-term success through meaningful connections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* Community Features */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center">
              <Sparkles className="w-6 h-6 text-primary mr-2" />
              Community Features
            </h3>
            
            <div className="space-y-6">
              {communityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 group"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8">
              <Button 
                size="lg" 
                variant="outline"
                className="border-border/50 hover:bg-accent/50"
              >
                Explore Community Tools
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Success Metrics */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">Community Impact</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-xl border border-border/50 p-6 text-center"
                  >
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-xl border border-border/50 p-6">
              <h4 className="font-semibold text-foreground mb-4">Success Story</h4>
              <blockquote className="text-muted-foreground leading-relaxed mb-4">
                "Our student community engagement increased by 92% after implementing the community features. 
                Students are more connected, collaborative, and successful than ever before."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">DR</span>
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">Dr. Rachel Martinez</div>
                  <div className="text-xs text-muted-foreground">Dean of Student Affairs</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};