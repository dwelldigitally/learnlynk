import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Phone, Building, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StudentServices: React.FC = () => {
  const services = [
    {
      title: "Student Support",
      description: "Get help and assistance with academic, personal, and technical support",
      icon: HelpCircle,
      path: "/student/support",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Emergency Contacts",
      description: "Important contact information for emergencies and urgent situations",
      icon: Phone,
      path: "/student/emergency-contacts",
      color: "bg-red-50 hover:bg-red-100 border-red-200"
    },
    {
      title: "Housing",
      description: "Accommodation information, residence hall details, and housing support",
      icon: Building,
      path: "/student/housing",
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Student Services</h1>
        <p className="text-muted-foreground text-lg">
          Access support services and important resources for your student life
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link key={service.title} to={service.path}>
            <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${service.color}`}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2">
                  {service.title}
                  <ExternalLink className="w-4 h-4 opacity-60" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Need Immediate Help?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="text-center">
            <h3 className="font-medium text-primary">Campus Security</h3>
            <p className="text-sm text-muted-foreground">24/7 Emergency Line</p>
            <p className="font-mono text-lg">(555) 123-0000</p>
          </div>
          <div className="text-center">
            <h3 className="font-medium text-primary">Student Help Desk</h3>
            <p className="text-sm text-muted-foreground">Technical & Academic Support</p>
            <p className="font-mono text-lg">(555) 123-HELP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentServices;