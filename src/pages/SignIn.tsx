
import React from "react";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img 
            src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
            alt="Learnlynk Logo" 
            className="h-10 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">Sign in to Learnlynk</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Sign in to access your account.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-saas-blue text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate("/sign-up")}
              className="text-saas-blue hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
