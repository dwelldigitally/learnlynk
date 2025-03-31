
import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const PropertyImportScreen: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState({
    contact: true,
    company: true,
    deals: true,
    activities: true,
    emails: false,
    meetings: true,
    calls: true,
    products: false,
    quotes: false,
    attachments: false,
  });

  const handlePropertyChange = (property: string) => {
    setSelectedProperties({
      ...selectedProperties,
      [property]: !selectedProperties[property as keyof typeof selectedProperties],
    });
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Select Data to Import
        </h1>
        <p className="text-saas-gray-medium">
          Choose which properties and data you want to import from your CRM
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <h3 className="font-medium">Core Data</h3>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="contact" 
              checked={selectedProperties.contact}
              onCheckedChange={() => handlePropertyChange('contact')}
            />
            <div className="flex-1">
              <Label htmlFor="contact" className="font-medium">Contacts</Label>
              <p className="text-sm text-saas-gray-medium">All leads and contacts</p>
            </div>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Required
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="company" 
              checked={selectedProperties.company}
              onCheckedChange={() => handlePropertyChange('company')}
            />
            <div className="flex-1">
              <Label htmlFor="company" className="font-medium">Companies</Label>
              <p className="text-sm text-saas-gray-medium">Account and company data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="deals" 
              checked={selectedProperties.deals}
              onCheckedChange={() => handlePropertyChange('deals')}
            />
            <div className="flex-1">
              <Label htmlFor="deals" className="font-medium">Deals/Opportunities</Label>
              <p className="text-sm text-saas-gray-medium">Historical and current deals</p>
            </div>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Recommended
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Activity Data</h3>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="activities" 
              checked={selectedProperties.activities}
              onCheckedChange={() => handlePropertyChange('activities')}
            />
            <div className="flex-1">
              <Label htmlFor="activities" className="font-medium">Activities</Label>
              <p className="text-sm text-saas-gray-medium">All tracked activities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="emails" 
              checked={selectedProperties.emails}
              onCheckedChange={() => handlePropertyChange('emails')}
            />
            <div className="flex-1">
              <Label htmlFor="emails" className="font-medium">Emails</Label>
              <p className="text-sm text-saas-gray-medium">Email communications</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="meetings" 
              checked={selectedProperties.meetings}
              onCheckedChange={() => handlePropertyChange('meetings')}
            />
            <div className="flex-1">
              <Label htmlFor="meetings" className="font-medium">Meetings</Label>
              <p className="text-sm text-saas-gray-medium">Calendar appointments</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox 
              id="calls" 
              checked={selectedProperties.calls}
              onCheckedChange={() => handlePropertyChange('calls')}
            />
            <div className="flex-1">
              <Label htmlFor="calls" className="font-medium">Calls</Label>
              <p className="text-sm text-saas-gray-medium">Call records</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-saas-gray-light p-4 rounded-lg border border-gray-200 mb-2">
        <h3 className="font-medium mb-2">Additional Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <Checkbox 
              id="products" 
              checked={selectedProperties.products}
              onCheckedChange={() => handlePropertyChange('products')}
            />
            <Label htmlFor="products" className="font-medium">Products</Label>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <Checkbox 
              id="quotes" 
              checked={selectedProperties.quotes}
              onCheckedChange={() => handlePropertyChange('quotes')}
            />
            <Label htmlFor="quotes" className="font-medium">Quotes</Label>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <Checkbox 
              id="attachments" 
              checked={selectedProperties.attachments}
              onCheckedChange={() => handlePropertyChange('attachments')}
            />
            <Label htmlFor="attachments" className="font-medium">Attachments</Label>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-saas-gray-medium mt-4">
        <strong>Note:</strong> The more data you import, the more accurate our AI assignment algorithm will be.
      </div>
    </div>
  );
};

export default PropertyImportScreen;
