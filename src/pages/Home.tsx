import React from 'react';
import { Button } from '@/components/ui/button';
import { NeoCard } from '@/components/modern/NeoCard';
import { GlassCard } from '@/components/modern/GlassCard';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  GraduationCap, 
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Smart Admissions",
      description: "AI-powered application processing and student matching for optimal program placement."
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Team Management",
      description: "Streamline your team's workflow with intelligent task distribution and performance tracking."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Analytics Dashboard",
      description: "Real-time insights into enrollment trends, student success rates, and institutional performance."
    },
    {
      icon: <Shield className="w-8 h-8 text-accent" />,
      title: "Secure Platform",
      description: "Enterprise-grade security with role-based access control and data encryption."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Program Management",
      description: "Comprehensive tools for curriculum planning, course scheduling, and resource allocation."
    },
    {
      icon: <Award className="w-8 h-8 text-accent" />,
      title: "Student Success",
      description: "Track student progress, identify at-risk learners, and provide targeted support interventions."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Students Managed" },
    { value: "95%", label: "Enrollment Success" },
    { value: "500+", label: "Institutions" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
                alt="Learnlynk Logo" 
                className="h-8"
              />
              <span className="text-xl font-bold text-foreground">Learnlynk</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/sign-in')}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/sign-up')}
                className="bg-primary hover:bg-primary-hover"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-16 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Educational Institution
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline admissions, enhance student success, and optimize institutional performance 
              with our comprehensive education management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center stagger-2">
              <Button 
                size="lg" 
                onClick={() => navigate('/sign-up')}
                className="bg-primary hover:bg-primary-hover px-8 py-6 text-lg neo-button"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg glass-button"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center stagger-1 animate-fade-up">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for educational institutions 
              to streamline operations and enhance student outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <NeoCard key={index} className={`stagger-${Math.min(index + 1, 5)} animate-fade-up`}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-muted rounded-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </NeoCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-subtle">
        <div className="container mx-auto">
          <GlassCard className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of educational institutions already using Learnlynk 
                to streamline their operations and improve student outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/sign-up')}
                  className="bg-primary hover:bg-primary-hover px-8 py-6 text-lg"
                >
                  Start Your Free Trial
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 mr-2 text-success" />
                  No credit card required
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-muted border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
              alt="Learnlynk Logo" 
              className="h-6"
            />
            <span className="text-lg font-semibold text-foreground">Learnlynk</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Learnlynk. All rights reserved. Transforming education through technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;