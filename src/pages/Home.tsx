import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, ArrowRight, Menu, X, CheckCircle, Star, Clock, Shield, TrendingUp } from 'lucide-react';
import { AnimatedSection } from '@/components/animated/AnimatedSection';
import { VideoSection } from '@/components/animated/VideoSection';
import { InteractiveFeatures } from '@/components/animated/InteractiveFeatures';
import { StatisticsCounter } from '@/components/animated/StatisticsCounter';
import { ParallaxSection } from '@/components/animated/ParallaxSection';
import { ModernNavigation } from '@/components/modern/ModernNavigation';
import { ModernHero } from '@/components/modern/ModernHero';
import { motion, useScroll, useTransform } from 'framer-motion';
import heroImage from '@/assets/education-hero.jpg';
import demoVideoImage from '@/assets/demo-video-poster.jpg';
import heroVideoImage from '@/assets/hero-video-poster.jpg';
import crmDashboard from '@/assets/crm-dashboard.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const testimonials = [
    {
      quote: "Learnlynk transformed our enrollment process. We've seen a 40% increase in qualified applications and our team is more efficient than ever.",
      name: "Dr. Sarah Johnson",
      title: "Vice President of Enrollment",
      institution: "State University",
      avatar: "SJ"
    },
    {
      quote: "The predictive analytics helped us identify at-risk students early and implement targeted support, improving our retention by 25%.",
      name: "Michael Chen",
      title: "Director of Student Success",
      institution: "Community College Network",
      avatar: "MC"
    },
    {
      quote: "Integration with our existing systems was seamless. The platform pays for itself through improved efficiency and higher conversion rates.",
      name: "Dr. Amanda Rodriguez",
      title: "Chief Information Officer",
      institution: "Metropolitan University",
      avatar: "AR"
    }
  ];

  const integrations = [
    { name: "Salesforce", logo: "🔗" },
    { name: "Canvas LMS", logo: "📚" },
    { name: "Banner ERP", logo: "🏛️" },
    { name: "Blackboard", logo: "📋" },
    { name: "PeopleSoft", logo: "👥" },
    { name: "Workday", logo: "💼" }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden mesh-gradient">
      {/* Modern Navigation */}
      <ModernNavigation />

      {/* Modern Hero Section with Aurora */}
      <div className="aurora-hero">
        <ModernHero />
      </div>

      {/* Animated Statistics Section with Subtle Aurora */}
      <AnimatedSection animation="fadeIn" className="py-16 px-6 bg-muted/30 aurora-subtle">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Proven Results Across Higher Education
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join leading institutions that have transformed their enrollment and retention outcomes
            </motion.p>
          </div>
          <StatisticsCounter />
        </div>
      </AnimatedSection>

      {/* Video Demo Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <AnimatedSection animation="fadeIn" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              See Learnlynk in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how leading institutions are transforming their student lifecycle management
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="scale" className="max-w-4xl mx-auto">
            <VideoSection
              src="#" // Placeholder - would be actual video URL
              poster={demoVideoImage}
              title="Complete Platform Walkthrough"
              description="Discover how Learnlynk streamlines enrollment, improves retention, and drives student success"
              className="h-96 md:h-[500px]"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Features Section with Subtle Aurora */}
      <section className="py-20 px-6 bg-muted/30 aurora-subtle">
        <div className="container mx-auto">
          <AnimatedSection animation="fadeIn" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Purpose-Built for Higher Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unlike generic CRMs, Learnlynk is designed specifically for the unique challenges 
              of student recruitment, enrollment, and success in higher education.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp">
            <InteractiveFeatures />
          </AnimatedSection>
        </div>
      </section>

      {/* Integration Carousel */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <AnimatedSection animation="fadeIn" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-lg text-muted-foreground">
              Connect with your existing education technology stack
            </p>
          </AnimatedSection>
          
          <motion.div 
            className="flex overflow-hidden space-x-8"
            animate={{ x: [0, -100] }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "linear" 
            }}
          >
            {[...integrations, ...integrations].map((integration, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 bg-card rounded-lg p-6 border min-w-[200px] text-center"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-2">{integration.logo}</div>
                <h3 className="font-semibold">{integration.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Animated Testimonials with Warm Aurora */}
      <section className="py-20 px-6 bg-muted/30 aurora-warm">
        <div className="container mx-auto">
          <AnimatedSection animation="fadeIn" className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Trusted by Educational Leaders
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection 
                key={index} 
                animation="slideUp" 
                delay={index * 0.2}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-card h-full">
                    <CardContent className="p-8">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </div>
                      <blockquote className="text-lg text-muted-foreground mb-6 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {testimonial.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.institution}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Animated CTA Section with Vibrant Aurora */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-primary-glow aurora-vibrant">
        <div className="container mx-auto">
          <AnimatedSection animation="scale">
            <Card className="text-center max-w-4xl mx-auto border-0 shadow-2xl bg-background">
              <CardContent className="p-12">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                >
                  Ready to Transform Your Institution?
                </motion.h2>
                <motion.p 
                  className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Join over 1,200 educational institutions already using Learnlynk 
                  to increase enrollment and improve student success rates.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/sign-up')}
                    className="bg-primary hover:bg-primary-hover px-8 py-4 text-lg font-semibold group"
                  >
                    Start Your Free 30-Day Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-4 text-lg border-border hover:bg-muted"
                  >
                    Schedule a Demo
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                    Setup in under 5 minutes
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                    FERPA compliant
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-muted">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src="/lovable-uploads/48c3582c-ccc2-44ba-a7b2-4baa993dc1d8.png" 
                  alt="Learnlynk Logo" 
                  className="h-8"
                />
                <span className="text-xl font-bold">Learnlynk</span>
              </motion.div>
              <p className="text-muted-foreground mb-4">
                Transforming education through intelligent CRM solutions designed specifically for higher education institutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2024 Learnlynk. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;