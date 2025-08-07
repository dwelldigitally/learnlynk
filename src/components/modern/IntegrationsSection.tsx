import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';

const integrations = [
  { name: "Canvas LMS", logo: "🎨", category: "Learning Management" },
  { name: "Blackboard", logo: "⚫", category: "Learning Management" },
  { name: "Moodle", logo: "🎓", category: "Learning Management" },
  { name: "Banner ERP", logo: "🏛️", category: "Student Information" },
  { name: "PeopleSoft", logo: "👥", category: "Student Information" },
  { name: "PowerSchool", logo: "⚡", category: "Student Information" },
  { name: "Salesforce", logo: "☁️", category: "CRM" },
  { name: "HubSpot", logo: "🧡", category: "CRM" },
  { name: "Microsoft Teams", logo: "💬", category: "Communication" },
  { name: "Zoom", logo: "📹", category: "Communication" },
  { name: "Google Workspace", logo: "🌐", category: "Productivity" },
  { name: "Slack", logo: "💼", category: "Communication" }
];

const benefits = [
  "Connect with 50+ education tools",
  "One-click setup for popular platforms",
  "Real-time data synchronization",
  "API access for custom integrations"
];

export const IntegrationsSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
          Seamless Integration
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Works with your{' '}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            existing tools
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect seamlessly with your current education technology stack. 
          No disruption, just enhanced functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* Integration Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-6 text-foreground">Popular Integrations</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-xl border border-border/50 p-4 text-center hover:border-primary/30 transition-all duration-300">
                  <div className="text-2xl mb-2">{integration.logo}</div>
                  <div className="font-medium text-foreground text-sm mb-1">{integration.name}</div>
                  <div className="text-xs text-muted-foreground">{integration.category}</div>
                </div>
              </motion.div>
            ))}
            
            {/* Add More Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: integrations.length * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 backdrop-blur-xl rounded-xl border border-primary/30 p-4 text-center hover:border-primary/50 transition-all duration-300 cursor-pointer">
                <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-primary text-sm">50+ More</div>
                <div className="text-xs text-primary/70">Integrations</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              variant="outline"
              className="border-border/50 hover:bg-accent/50 w-full"
            >
              View All Integrations
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Benefits */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6 text-foreground">Integration Benefits</h3>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl rounded-xl border border-border/50 p-6">
              <h4 className="font-semibold text-foreground mb-3">Quick Setup</h4>
              <p className="text-muted-foreground mb-4">
                Most integrations can be set up in under 5 minutes with our guided setup wizard. 
                No technical expertise required.
              </p>
              <Button 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground"
              >
                Start Setup
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};