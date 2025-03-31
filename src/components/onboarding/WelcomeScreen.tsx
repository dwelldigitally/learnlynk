
import React, { useState } from "react";
import { ArrowRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Chatbot from "../Chatbot";
import { useAuth } from "@clerk/clerk-react";

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isSignedIn } = useAuth();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleGetStarted = () => {
    // Navigate to step 2
    navigate("/?step=2");
    // Force page reload to ensure state is updated
    window.location.href = "/?step=2";
  };

  // Function to handle direct navigation to any step
  const navigateToStep = (step: number) => {
    navigate(`/?step=${step}`);
    // Force page reload to ensure state is updated
    window.location.href = `/?step=${step}`;
  };

  const faqs = [
    {
      question: "What does Learnlynk include?",
      answer: "Learnlynk includes AI-powered lead distribution, team performance analytics, integration with major CRMs, custom reporting, and ROI tracking. Our platform helps sales teams increase conversion rates by 35% on average."
    },
    {
      question: "How does Learnlynk help improve sales performance?",
      answer: "Learnlynk analyzes historical data to match leads with the most suitable sales representatives based on their strengths, experience, and past performance patterns. This intelligent matching increases conversion rates and overall team efficiency."
    },
    {
      question: "How does Learnlynk integrate with my CRM?",
      answer: "Learnlynk seamlessly connects with popular CRMs like Salesforce, HubSpot, and Zoho through our secure API. The setup process takes minutes, and our system will start optimizing your lead distribution immediately."
    },
    {
      question: "Does Learnlynk support custom lead routing rules?",
      answer: "Yes, Learnlynk allows you to set custom rules and exceptions to the AI-based distribution. You can create special rules for specific lead sources, territories, or high-value prospects."
    },
    {
      question: "How long does it take to implement Learnlynk?",
      answer: "Most teams are up and running with Learnlynk in less than 24 hours. Our onboarding process guides you through CRM integration, team setup, and initial configuration in a step-by-step process."
    },
    {
      question: "What kind of support does Learnlynk offer?",
      answer: "Learnlynk provides 24/7 customer support via chat, email, and phone. All plans include access to our knowledge base, video tutorials, and regular webinars on maximizing your platform usage."
    },
    {
      question: "Does Learnlynk offer a free trial?",
      answer: "Yes, Learnlynk offers a 14-day free trial with full access to all features. No credit card is required to start your trial. You can upgrade to a paid plan at any time during or after your trial period."
    }
  ];

  const integrations = [
    {
      name: "Salesforce",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      description: "Connect your entire sales workflow with our native Salesforce integration"
    },
    {
      name: "HubSpot",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/HubSpot_Logo.svg/1200px-HubSpot_Logo.svg.png",
      description: "Seamlessly integrate with HubSpot CRM for optimized lead management"
    },
    {
      name: "Zoho",
      logo: "https://www.zohowebstatic.com/sites/default/files/ogimage/zoho-logo.png",
      description: "Use our Zoho integration to distribute leads intelligently across your team"
    },
    {
      name: "Pipedrive",
      logo: "https://seeklogo.com/images/P/pipedrive-logo-8153D68A59-seeklogo.com.png",
      description: "Enhance your Pipedrive workflow with AI-powered lead assignments"
    },
    {
      name: "Microsoft Dynamics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Microsoft_Dynamics_365_logo.svg/1200px-Microsoft_Dynamics_365_logo.svg.png",
      description: "Boost your team's efficiency with our Microsoft Dynamics 365 integration"
    },
    {
      name: "Custom CRM",
      logo: "https://cdn-icons-png.flaticon.com/512/5956/5956592.png",
      description: "Connect virtually any CRM using our robust API and webhooks"
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header / Navigation */}
      <header className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
              alt="Learnlynk Logo" 
              className="h-8"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-saas-blue font-medium">Features</a>
            <a href="#integrations" className="text-gray-600 hover:text-saas-blue font-medium">Integrations</a>
            <a href="#pricing" className="text-gray-600 hover:text-saas-blue font-medium">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-saas-blue font-medium">FAQ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:flex" onClick={() => navigate('/sign-in')}>Log in</Button>
            <Button className="bg-saas-blue hover:bg-blue-600" onClick={() => navigate('/sign-up')}>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Manual Navigation Buttons */}
      <div className="fixed right-6 top-24 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="font-semibold mb-2 text-sm">Navigate Directly:</div>
        <div className="space-y-2">
          <Button 
            onClick={() => navigateToStep(2)} 
            className="w-full bg-saas-blue text-white hover:bg-blue-600"
            size="sm"
          >
            Go to Step 2
          </Button>
          {Array.from({ length: 8 }).map((_, i) => (
            <Button 
              key={i+3}
              onClick={() => navigateToStep(i+3)} 
              variant="outline"
              className="w-full text-xs"
              size="sm"
            >
              Step {i+3}
            </Button>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {isSignedIn ? "You are signed in" : "Please sign in first"}
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Revolutionizing <span className="text-saas-blue">Sales Lead</span> Distribution
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Our AI-powered system matches leads with the perfect sales rep, increasing conversion rates by 35% and boosting team performance.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  className="bg-saas-blue hover:bg-blue-600 text-lg px-8 py-6"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="text-lg px-8 py-6">
                  Watch Demo
                </Button>
              </div>
              <p className="mt-4 text-gray-500">
                14-day free trial. No credit card required.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
                <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-green-100 rounded-full z-0"></div>
                
                <div className="relative z-10 bg-white p-1 rounded-xl shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800" 
                    alt="Sales team success" 
                    className="rounded-lg w-full"
                  />
                </div>
                
                <div className="absolute top-1/4 -right-12 bg-white p-3 rounded-lg shadow-lg flex items-center gap-2 z-20">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">+35% Conversions</span>
                </div>
                
                <div className="absolute bottom-10 -left-12 bg-white p-3 rounded-lg shadow-lg flex items-center gap-2 z-20">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">+42% ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Microsoft", "Adobe", "Shopify", "Deloitte", "IBM"].map((company) => (
              <div key={company} className="grayscale opacity-70 hover:opacity-100 transition-opacity">
                <p className="text-xl font-bold">{company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Can Learnlynk Do?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent platform uses AI to optimize your sales process, increase conversions, and give you valuable insights into your team's performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">CRM Connectivity</h3>
                <p className="text-gray-600 mb-6">
                  Seamlessly connects with major CRMs to import your leads and sales data for AI-powered distribution.
                </p>
                <Button variant="outline" className="bg-white">
                  Learn more
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600" 
                alt="CRM Integration" 
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Feature 2 */}
            <div className="bg-saas-blue text-white rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Intelligent Lead Routing</h3>
                <p className="text-white/80 mb-6">
                  Our AI analyzes rep performance and lead characteristics to match each lead with the best-suited sales representative.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn more
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600" 
                alt="AI Lead Routing" 
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 text-white rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Team Performance Insights</h3>
                <p className="text-white/80 mb-6">
                  Get detailed analytics on rep performance, conversion rates, and areas for improvement with our actionable insights.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn more
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600" 
                alt="Performance Analytics" 
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Measure Everything</h3>
                <p className="text-gray-600 mb-6">
                  Track ROI, conversion rates, and team performance with comprehensive analytics and custom reporting.
                </p>
                <Button variant="outline" className="bg-white">
                  Learn more
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600" 
                alt="Analytics Dashboard" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Boost your efficiency with integrations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-16">
            Learnlynk connects with your favorite tools to create a seamless sales workflow
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 mb-4 overflow-hidden">
                  <img 
                    src={integration.logo} 
                    alt={integration.name} 
                    className="h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                <p className="text-gray-600">{integration.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" className="mx-auto">
              Explore all integrations
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-saas-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get started with Learnlynk today
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of sales teams that use Learnlynk to boost conversions, optimize performance, and increase revenue.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-saas-blue hover:bg-gray-100 text-lg px-8 py-6"
          >
            Start free trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-white/80">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <img 
                src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
                alt="Learnlynk Logo" 
                className="h-8 mb-4"
              />
              <p className="text-gray-600 mb-4 max-w-xs">
                Transforming sales teams with AI-powered lead distribution and analytics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-saas-blue">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-saas-blue">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-saas-blue">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-saas-blue">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-saas-blue">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2023 Learnlynk. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-saas-blue text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-saas-blue text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-saas-blue text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot mode="homepage" />
    </div>
  );
};

export default WelcomeScreen;
