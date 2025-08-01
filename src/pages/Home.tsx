import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Shield, 
  BarChart3, 
  Users, 
  GraduationCap, 
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Globe,
  Clock,
  Star,
  Building2,
  PlayCircle
} from 'lucide-react';
import educationHero from '@/assets/education-hero.jpg';
import crmDashboard from '@/assets/crm-dashboard.jpg';
import studentsAI from '@/assets/students-ai.jpg';
import educationAnalytics from '@/assets/education-analytics.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Enrollment",
      description: "Leverage machine learning to predict enrollment trends, optimize recruitment strategies, and increase conversion rates by 40%."
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-600" />,
      title: "Student Lifecycle Management",
      description: "Track every touchpoint from initial inquiry to alumni engagement with comprehensive pipeline management and automated workflows."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Predictive Analytics",
      description: "Identify at-risk students early, predict retention rates, and optimize resource allocation with real-time institutional intelligence."
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      title: "Automated Communications",
      description: "Deploy personalized, multichannel campaigns that nurture prospects and engage current students with AI-driven messaging."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "FERPA Compliant",
      description: "Enterprise-grade security with full FERPA compliance, role-based access control, and audit trails for complete data protection."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Integration Ecosystem",
      description: "Seamlessly connect with your existing SIS, LMS, and financial systems through our robust API and pre-built integrations."
    }
  ];

  const solutions = [
    {
      title: "Admissions & Recruitment",
      description: "Streamline your entire admissions funnel with AI-powered lead scoring and automated nurture campaigns.",
      image: studentsAI,
      stats: ["3x faster application processing", "45% increase in qualified leads", "60% reduction in manual tasks"]
    },
    {
      title: "Student Success & Retention",
      description: "Proactively identify at-risk students and deploy targeted interventions to improve retention rates.",
      image: educationAnalytics,
      stats: ["25% improvement in retention", "Early warning system", "Personalized support plans"]
    },
    {
      title: "Institutional Analytics",
      description: "Make data-driven decisions with comprehensive dashboards and predictive modeling capabilities.",
      image: crmDashboard,
      stats: ["Real-time reporting", "Predictive modeling", "ROI optimization"]
    }
  ];

  const stats = [
    { value: "2.5M+", label: "Students Managed" },
    { value: "89%", label: "Average Retention Rate" },
    { value: "1,200+", label: "Educational Institutions" },
    { value: "45%", label: "Increase in Enrollment" }
  ];

  const testimonials = [
    {
      quote: "Learnlynk transformed our enrollment process. We've seen a 40% increase in qualified applications and our team is more efficient than ever.",
      name: "Dr. Sarah Johnson",
      title: "Vice President of Enrollment",
      institution: "State University"
    },
    {
      quote: "The predictive analytics helped us identify at-risk students early and implement targeted support, improving our retention by 25%.",
      name: "Michael Chen",
      title: "Director of Student Success",
      institution: "Community College Network"
    }
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
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(16, 185, 129, 0.8)), url(${educationHero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Trusted by 1,200+ Institutions
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                The Future of
                <span className="block text-emerald-300">
                  Education CRM
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                Harness the power of AI to transform student recruitment, engagement, and success. 
                Drive enrollment growth while ensuring no student falls through the cracks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/sign-up')}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Start Free 30-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center text-white/80 text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-300" />
                No credit card required • Setup in under 5 minutes
              </div>
            </div>
            <div className="lg:block hidden">
              <div className="relative">
                <img 
                  src={crmDashboard} 
                  alt="Education CRM Dashboard" 
                  className="rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Enrollment Up</div>
                      <div className="text-xs text-gray-600">+45% this quarter</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proven Results Across Higher Education</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join leading institutions that have transformed their enrollment and retention outcomes
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Purpose-Built for Higher Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike generic CRMs, Learnlynk is designed specifically for the unique challenges 
              of student recruitment, enrollment, and success in higher education.
            </p>
          </div>
          
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
                  <div className="space-y-3">
                    {solution.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                        <span className="text-gray-700 font-medium">{stat}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img 
                    src={solution.image} 
                    alt={solution.title}
                    className="rounded-xl shadow-xl w-full h-auto"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Advanced Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to modernize your student lifecycle management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <CardContent className="p-8">
                  <div className="flex flex-col items-start text-left">
                    <div className="mb-4 p-3 bg-gray-100 rounded-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Educational Leaders
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.title}</div>
                      <div className="text-sm text-gray-500">{testimonial.institution}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container mx-auto">
          <Card className="text-center max-w-4xl mx-auto border-0 shadow-2xl bg-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join over 1,200 educational institutions already using Learnlynk 
                to increase enrollment and improve student success rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/sign-up')}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold"
                >
                  Start Your Free 30-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Schedule a Demo
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-gray-500">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
                  alt="Learnlynk Logo" 
                  className="h-8"
                />
                <span className="text-xl font-bold">Learnlynk</span>
              </div>
              <p className="text-gray-400 mb-4">
                The leading AI-powered CRM platform designed specifically for higher education institutions.
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2" />
                SOC 2 Type II & FERPA Compliant
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Admissions & Recruitment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Success</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Alumni Relations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics & Reporting</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Learnlynk. All rights reserved. Empowering educational institutions with AI-driven insights.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;