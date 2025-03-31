
import React, { useState, useEffect } from "react";
import { Check, X, Info, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import hubspotService from "@/services/hubspotService";
import { toast } from "sonner";

const PropertyImportScreen: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importComplete, setImportComplete] = useState(false);
  const [importStats, setImportStats] = useState({
    contacts: 0,
    companies: 0,
    deals: 0,
    activities: 0,
  });

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

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        const connected = await hubspotService.testConnection();
        setIsConnected(connected);
        if (!connected) {
          toast.error("Please connect to HubSpot before importing data", {
            description: "Go back to the previous step to establish connection",
          });
        }
      } catch (error) {
        console.error("Error checking HubSpot connection:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);

  const handlePropertyChange = (property: string) => {
    setSelectedProperties({
      ...selectedProperties,
      [property]: !selectedProperties[property as keyof typeof selectedProperties],
    });
  };

  const startImport = async () => {
    if (!isConnected) {
      toast.error("Please connect to HubSpot first");
      return;
    }
    
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      // Get selected objects to import
      const selectedObjects = Object.entries(selectedProperties)
        .filter(([_, selected]) => selected)
        .map(([key]) => key);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      // Import the data
      const stats = await hubspotService.importData(selectedObjects);
      
      // Finish the progress animation
      clearInterval(progressInterval);
      setImportProgress(100);
      setImportStats(stats);
      setImportComplete(true);
      
      toast.success("Data imported successfully", {
        description: `Imported ${stats.contacts} contacts, ${stats.companies} companies, ${stats.deals} deals, and ${stats.activities} activities.`
      });
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error("Failed to import data from HubSpot");
    } finally {
      setIsImporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="slide-container flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Checking HubSpot connection...</p>
      </div>
    );
  }

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Import HubSpot Data
        </h1>
        <p className="text-saas-gray-medium">
          Select which properties and data you want to import from HubSpot
        </p>
      </div>
      
      {!isConnected ? (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
          <h3 className="font-medium flex items-center text-amber-800">
            <Info className="h-5 w-5 mr-2" />
            HubSpot Connection Required
          </h3>
          <p className="text-sm mt-2 text-amber-700">
            Please go back to the previous step and connect your HubSpot account before importing data.
          </p>
        </div>
      ) : (
        <>
          {importComplete ? (
            <div className="bg-green-50 p-6 rounded-lg border border-green-100 mb-6">
              <h3 className="font-medium flex items-center text-green-800">
                <Check className="h-5 w-5 mr-2" />
                Import Complete
              </h3>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-lg text-center border border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">{importStats.contacts}</div>
                  <div className="text-sm text-gray-500">Contacts</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center border border-gray-100">
                  <div className="text-2xl font-bold text-green-600">{importStats.companies}</div>
                  <div className="text-sm text-gray-500">Companies</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center border border-gray-100">
                  <div className="text-2xl font-bold text-purple-600">{importStats.deals}</div>
                  <div className="text-sm text-gray-500">Deals</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center border border-gray-100">
                  <div className="text-2xl font-bold text-orange-600">{importStats.activities}</div>
                  <div className="text-sm text-gray-500">Activities</div>
                </div>
              </div>
              
              <p className="text-sm mt-4 text-green-700">
                Your HubSpot data has been successfully imported and is ready for AI analysis.
              </p>
              
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportComplete(false);
                    setImportProgress(0);
                  }}
                >
                  Import More Data
                </Button>
              </div>
            </div>
          ) : isImporting ? (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
              <h3 className="font-medium flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-600" />
                Importing Data from HubSpot
              </h3>
              
              <div className="mt-4">
                <Progress value={importProgress} className="h-2" />
                <p className="text-sm mt-2 text-gray-600">{Math.round(importProgress)}% complete</p>
              </div>
              
              <p className="text-sm mt-4 text-gray-600">
                This may take a few minutes depending on the amount of data. Please don't close this window.
              </p>
            </div>
          ) : (
            <></>
          )}
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <h3 className="font-medium">Core Data</h3>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Checkbox 
                  id="contact" 
                  checked={selectedProperties.contact}
                  onCheckedChange={() => handlePropertyChange('contact')}
                  disabled={isImporting}
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
                  disabled={isImporting}
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
                  disabled={isImporting}
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
                  disabled={isImporting}
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
                  disabled={isImporting}
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
                  disabled={isImporting}
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
                  disabled={isImporting}
                />
                <div className="flex-1">
                  <Label htmlFor="calls" className="font-medium">Calls</Label>
                  <p className="text-sm text-saas-gray-medium">Call records</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-saas-gray-light p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-medium mb-2">Additional Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Checkbox 
                  id="products" 
                  checked={selectedProperties.products}
                  onCheckedChange={() => handlePropertyChange('products')}
                  disabled={isImporting}
                />
                <Label htmlFor="products" className="font-medium">Products</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Checkbox 
                  id="quotes" 
                  checked={selectedProperties.quotes}
                  onCheckedChange={() => handlePropertyChange('quotes')}
                  disabled={isImporting}
                />
                <Label htmlFor="quotes" className="font-medium">Quotes</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Checkbox 
                  id="attachments" 
                  checked={selectedProperties.attachments}
                  onCheckedChange={() => handlePropertyChange('attachments')}
                  disabled={isImporting}
                />
                <Label htmlFor="attachments" className="font-medium">Attachments</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-saas-gray-medium">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="underline cursor-help">
                    More data = better AI assignments
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The more data you import, the more accurately our AI can match leads with the right team members</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {!importComplete && (
              <Button 
                onClick={startImport} 
                disabled={isImporting || !selectedProperties.contact}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Start Import"
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyImportScreen;
