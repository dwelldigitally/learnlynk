
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with logo */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <img 
              src="/lovable-uploads/9b985eb3-4f7d-4a96-9fa2-2e7a85a64983.png" 
              alt="Learnlynk Logo" 
              className="h-10"
            />
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="outline">Log in</Button>
          </div>
        </header>

        {/* Hero section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-16">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Personalized Learning<br />Made Simple
            </h1>
            <p className="text-saas-gray-medium text-lg mb-8 max-w-lg">
              Our AI-powered platform helps educational teams connect students with the right learning resources and improve completion rates.
            </p>
            <Button className="bg-saas-blue hover:bg-saas-blue/90 text-white px-8 py-6 text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-saas-gray-medium text-sm mt-4">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800" 
              alt="Students learning" 
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Stats section */}
        <div className="grid md:grid-cols-2 gap-8 my-16">
          <div className="bg-saas-gray-light rounded-lg p-6 flex items-center justify-between">
            <span className="font-medium text-xl">Learning engagement</span>
            <span className="percentage-increase text-2xl">+42%</span>
          </div>
          <div className="bg-saas-gray-light rounded-lg p-6 flex items-center justify-between">
            <span className="font-medium text-xl">Course completion</span>
            <span className="percentage-increase text-2xl">+35%</span>
          </div>
        </div>
        
        {/* Benefits section */}
        <div className="my-16">
          <h2 className="text-3xl font-semibold mb-10 text-center">Key Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-saas-gray-light w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                <span className="text-xl">1</span>
              </div>
              <h3 className="font-bold text-xl mb-3">AI-Powered Learning Paths</h3>
              <p className="text-saas-gray-medium">
                Personalized learning recommendations based on student behavior and learning styles
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-saas-gray-light w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                <span className="text-xl">2</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Seamless Integration</h3>
              <p className="text-saas-gray-medium">
                Connect with your LMS, CRM, and content libraries with just a few clicks
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-saas-gray-light w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                <span className="text-xl">3</span>
              </div>
              <h3 className="font-bold text-xl mb-3">Comprehensive Analytics</h3>
              <p className="text-saas-gray-medium">
                Track engagement, progress, and outcomes with detailed reporting and insights
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-saas-gray-light rounded-xl p-10 text-center my-16">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your learning programs?</h2>
          <p className="text-saas-gray-medium text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions that use Learnlynk to improve learning outcomes.
          </p>
          <Button className="bg-saas-blue hover:bg-saas-blue/90 text-white px-8 py-6 text-lg">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 mt-16 pt-8 pb-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/9b985eb3-4f7d-4a96-9fa2-2e7a85a64983.png" 
                alt="Learnlynk Logo" 
                className="h-8 mb-2"
              />
              <p className="text-saas-gray-medium text-sm">
                © 2023 Learnlynk. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="font-medium mb-3">Product</h4>
                <ul className="space-y-2 text-saas-gray-medium">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Case Studies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2 text-saas-gray-medium">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Support</h4>
                <ul className="space-y-2 text-saas-gray-medium">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WelcomeScreen;
