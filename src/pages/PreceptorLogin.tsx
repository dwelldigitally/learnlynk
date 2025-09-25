import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Stethoscope, Shield, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PreceptorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      toast.success("Welcome back, Dr. Johnson!");
      navigate("/preceptor/dashboard");
      setLoading(false);
    }, 1500);
  };

  const demoCredentials = [
    { role: "Senior Preceptor", email: "dr.johnson@hospital.com", password: "demo123" },
    { role: "Clinical Supervisor", email: "nurse.williams@clinic.com", password: "demo123" },
    { role: "Site Coordinator", email: "coordinator@healthcenter.com", password: "demo123" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-full p-4">
                <Stethoscope className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Preceptor Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Clinical supervision and student progress monitoring
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Shield className="h-4 w-4" />
              <span className="font-medium text-sm">Demo Credentials</span>
            </div>
            {demoCredentials.map((cred, index) => (
              <div key={index} className="text-xs space-y-1 bg-white/50 dark:bg-black/10 rounded p-2">
                <div className="font-medium text-blue-800 dark:text-blue-200">{cred.role}</div>
                <div className="text-blue-600 dark:text-blue-400">Email: {cred.email}</div>
                <div className="text-blue-600 dark:text-blue-400">Password: {cred.password}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Login Form */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Features Preview */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium text-sm">What You Can Do</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs text-green-600 dark:text-green-400">
              <div>• Review student attendance & hours</div>
              <div>• Approve competency demonstrations</div>
              <div>• Provide feedback on reflections</div>
              <div>• Complete student evaluations</div>
              <div>• Digital signature & verification</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PreceptorLogin;