import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Search, 
  Brain, 
  Zap, 
  Check, 
  BookOpen, 
  DollarSign, 
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import AIWebsiteScanner from '../components/AIWebsiteScanner';

interface WebsiteScanningScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface DetectedProgram {
  name: string;
  description: string;
  duration: string;
  tuitionFee: string;
  applicationFee: string;
  requirements: string[];
  intakes: string[];
}

interface ScanResult {
  url: string;
  programs: DetectedProgram[];
  generalInfo: {
    institutionName: string;
    accreditation: string;
    established: string;
    studentBody: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  confidence: number;
}

const SCANNING_STAGES = [
  { id: 'connecting', label: 'Connecting to website...', icon: Globe },
  { id: 'analyzing', label: 'Analyzing website structure...', icon: Search },
  { id: 'extracting', label: 'Extracting program information...', icon: BookOpen },
  { id: 'detecting', label: 'Detecting fee structures...', icon: DollarSign },
  { id: 'mapping', label: 'Mapping application processes...', icon: Calendar },
  { id: 'finalizing', label: 'Finalizing AI analysis...', icon: Brain },
];

const WebsiteScanningScreen: React.FC<WebsiteScanningScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [websiteUrl, setWebsiteUrl] = useState(data?.url || '');
  const [isScanning, setIsScanning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(data?.scanResult || null);
  const [error, setError] = useState<string | null>(null);

  const mockScanResult: ScanResult = {
    url: websiteUrl,
    programs: [
      {
        name: "Bachelor of Computer Science",
        description: "Comprehensive 4-year program covering software development, algorithms, and computer systems.",
        duration: "4 years",
        tuitionFee: "$45,000/year",
        applicationFee: "$100",
        requirements: ["High School Diploma", "SAT Score: 1200+", "Math Prerequisites", "Letter of Recommendation"],
        intakes: ["Fall 2024", "Spring 2025"]
      },
      {
        name: "Master of Business Administration",
        description: "Advanced business program focusing on leadership, strategy, and innovation.",
        duration: "2 years",
        tuitionFee: "$55,000/year",
        applicationFee: "$150",
        requirements: ["Bachelor's Degree", "GMAT Score: 550+", "Work Experience: 2+ years", "Personal Statement"],
        intakes: ["Fall 2024", "Spring 2025", "Summer 2025"]
      },
      {
        name: "Certificate in Data Analytics",
        description: "Intensive 6-month program covering data science, machine learning, and business intelligence.",
        duration: "6 months",
        tuitionFee: "$8,500 total",
        applicationFee: "$75",
        requirements: ["Basic Programming Knowledge", "Statistics Background", "Portfolio Project"],
        intakes: ["Monthly Start Dates"]
      }
    ],
    generalInfo: {
      institutionName: "Tech University",
      accreditation: "ABET Accredited",
      established: "1985",
      studentBody: "12,000+ students"
    },
    contactInfo: {
      phone: "(555) 123-4567",
      email: "admissions@techuniv.edu",
      address: "123 University Ave, Tech City, TC 12345"
    },
    confidence: 94
  };

  const startScan = async () => {
    if (!websiteUrl) {
      toast({
        title: "URL Required",
        description: "Please enter your institution's website URL.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setError(null);
    setCurrentStage(0);

    try {
      // Simulate progressive scanning stages
      for (let i = 0; i < SCANNING_STAGES.length; i++) {
        setCurrentStage(i);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setScanResult(mockScanResult);
      
      toast({
        title: "Website Scanned Successfully!",
        description: `Found ${mockScanResult.programs.length} programs with ${mockScanResult.confidence}% confidence.`,
      });

    } catch (err) {
      setError("Failed to scan website. Please check the URL and try again.");
      toast({
        title: "Scan Failed",
        description: "Unable to analyze the website. You can skip this step and add programs manually.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    if (scanResult) {
      onComplete({
        url: websiteUrl,
        scanResult,
        detectedPrograms: scanResult.programs,
        institutionInfo: scanResult.generalInfo,
        contactInfo: scanResult.contactInfo
      });
      onNext();
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    setError(null);
    startScan();
  };

  if (isScanning) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            AI Website Analysis in Progress
          </h3>
          <p className="text-muted-foreground">
            Our AI is analyzing your website to automatically configure your programs and settings...
          </p>
        </div>

        <AIWebsiteScanner 
          url={websiteUrl}
          stages={SCANNING_STAGES}
          currentStage={currentStage}
          isActive={true}
        />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This usually takes 30-60 seconds. Please don't close this window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!scanResult ? (
        <>
          {/* URL Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url" className="text-foreground font-medium">
                Institution Website URL
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="website-url"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-institution.edu"
                  className="flex-1"
                />
                <Button onClick={startScan} disabled={!websiteUrl}>
                  <Search className="w-4 h-4 mr-2" />
                  Scan Website
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your website to automatically detect programs, fees, and requirements.
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
          </div>

          {/* AI Features Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  What We'll Detect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Academic programs and courses
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Tuition and fee structures
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Application requirements
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Intake dates and deadlines
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Brain className="w-5 h-5 mr-2 text-accent" />
                  Smart Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Auto-configure program settings
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Generate application forms
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Set up payment processing
                </div>
                <div className="flex items-center text-sm">
                  <Check className="w-4 h-4 mr-2 text-success" />
                  Create intake schedules
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={onSkip} className="glass-button">
              Skip Website Scan
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Scan Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Website Analysis Complete</h3>
                <p className="text-sm text-muted-foreground">
                  Confidence Score: {scanResult.confidence}% • Found {scanResult.programs.length} programs
                </p>
              </div>
              <Button variant="outline" onClick={handleRescan}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-scan
              </Button>
            </div>

            {/* Institution Info */}
            <Card>
              <CardHeader>
                <CardTitle>Institution Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Institution Name</Label>
                  <p className="text-foreground">{scanResult.generalInfo.institutionName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Accreditation</Label>
                  <p className="text-foreground">{scanResult.generalInfo.accreditation}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Established</Label>
                  <p className="text-foreground">{scanResult.generalInfo.established}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Student Body</Label>
                  <p className="text-foreground">{scanResult.generalInfo.studentBody}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detected Programs */}
            <div>
              <h4 className="font-medium text-foreground mb-4">Detected Programs</h4>
              <div className="grid gap-4">
                {scanResult.programs.map((program, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{program.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground">Duration</Label>
                          <p className="font-medium">{program.duration}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Tuition</Label>
                          <p className="font-medium">{program.tuitionFee}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Application Fee</Label>
                          <p className="font-medium">{program.applicationFee}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Intakes</Label>
                          <p className="font-medium">{program.intakes.join(', ')}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label className="text-muted-foreground">Requirements</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {program.requirements.map((req, reqIndex) => (
                            <span
                              key={reqIndex}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleConfirm} className="bg-primary hover:bg-primary-hover">
                <Check className="w-4 h-4 mr-2" />
                Confirm & Continue
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WebsiteScanningScreen;