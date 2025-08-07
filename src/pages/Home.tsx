import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernNavigation } from '@/components/modern/ModernNavigation';
import { ModernHero } from '@/components/modern/ModernHero';
import { AnimatedSection } from '@/components/animated/AnimatedSection';
import { StatisticsCounter } from '@/components/animated/StatisticsCounter';
import { BenefitsSection } from '@/components/modern/BenefitsSection';
import { FeaturesGrid } from '@/components/modern/FeaturesGrid';
import { WhyChooseSection } from '@/components/modern/WhyChooseSection';
import { CommunitySection } from '@/components/modern/CommunitySection';
import { IntegrationsSection } from '@/components/modern/IntegrationsSection';
import { CTASection } from '@/components/modern/CTASection';
import { GraduationCap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <ModernNavigation />
      
      {/* Hero Section */}
      <ModernHero />

      {/* Benefits Section */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-background to-muted/20">
        <BenefitsSection />
      </AnimatedSection>

      {/* Statistics Section */}
      <AnimatedSection className="py-20">
        <StatisticsCounter />
      </AnimatedSection>

      {/* Features Grid Section */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <FeaturesGrid />
      </AnimatedSection>

      {/* Why Choose Section */}
      <AnimatedSection className="py-20">
        <WhyChooseSection />
      </AnimatedSection>

      {/* Community Section */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-background to-muted/20">
        <CommunitySection />
      </AnimatedSection>

      {/* Integrations Section */}
      <AnimatedSection className="py-20">
        <IntegrationsSection />
      </AnimatedSection>

      {/* Final CTA Section */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <CTASection />
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">EduSuccess</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming education through intelligent student relationship management.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Student Applications</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Retention Management</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Analytics Dashboard</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community Building</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Implementation Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Best Practices</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">ROI Calculator</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Training Resources</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community Forum</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EduSuccess. All rights reserved. Built for educational excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;