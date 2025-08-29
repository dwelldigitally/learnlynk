import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Search, 
  Check, 
  ChevronRight,
  Clock,
  FileText,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface SelectiveWebsiteScannerProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface PageCategory {
  id: string;
  label: string;
  description: string;
  icon: any;
  pages: SuggestedPage[];
  selected: boolean;
}

interface SuggestedPage {
  url: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
}

interface ScanProgress {
  current: number;
  total: number;
  currentPage: string;
}

const QUICK_PRESETS = [
  { id: 'programs-only', label: 'Programs Only', description: 'Academic programs and courses' },
  { id: 'admissions-focus', label: 'Admissions Focus', description: 'Programs, requirements, and applications' },
  { id: 'full-academic', label: 'Full Academic Info', description: 'Everything academic-related' }
];

const SelectiveWebsiteScanner: React.FC<SelectiveWebsiteScannerProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'url' | 'discovery' | 'selection' | 'scanning' | 'results'>('url');
  const [websiteUrl, setWebsiteUrl] = useState(data?.url || '');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [scanProgress, setScanProgress] = useState<ScanProgress>({ current: 0, total: 0, currentPage: '' });
  const [scanResults, setScanResults] = useState<any>(null);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const discoverPages = async () => {
    if (!websiteUrl) {
      toast({
        title: "URL Required",
        description: "Please enter your institution's website URL.",
        variant: "destructive"
      });
      return;
    }

    setIsDiscovering(true);
    
    try {
      // Simulate page discovery - in reality this would be a quick site crawl
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock discovered categories
      const mockCategories: PageCategory[] = [
        {
          id: 'programs',
          label: 'Academic Programs',
          description: 'Degree programs, courses, and curricula',
          icon: GraduationCap,
          selected: true,
          pages: [
            { url: `${websiteUrl}/programs`, title: 'Academic Programs', description: 'Main programs page', category: 'programs', confidence: 95 },
            { url: `${websiteUrl}/undergraduate`, title: 'Undergraduate Programs', description: 'Bachelor degree programs', category: 'programs', confidence: 90 },
            { url: `${websiteUrl}/graduate`, title: 'Graduate Programs', description: 'Master and PhD programs', category: 'programs', confidence: 90 },
            { url: `${websiteUrl}/courses`, title: 'Course Catalog', description: 'Individual course listings', category: 'programs', confidence: 85 }
          ]
        },
        {
          id: 'admissions',
          label: 'Admissions Info',
          description: 'Requirements, processes, and applications',
          icon: FileText,
          selected: true,
          pages: [
            { url: `${websiteUrl}/admissions`, title: 'Admissions', description: 'Main admissions page', category: 'admissions', confidence: 95 },
            { url: `${websiteUrl}/requirements`, title: 'Entry Requirements', description: 'Admission requirements', category: 'admissions', confidence: 90 },
            { url: `${websiteUrl}/apply`, title: 'Application Process', description: 'How to apply', category: 'admissions', confidence: 88 }
          ]
        },
        {
          id: 'fees',
          label: 'Fees & Tuition',
          description: 'Tuition costs and fee structures',
          icon: DollarSign,
          selected: true,
          pages: [
            { url: `${websiteUrl}/tuition`, title: 'Tuition & Fees', description: 'Cost information', category: 'fees', confidence: 92 },
            { url: `${websiteUrl}/financial-aid`, title: 'Financial Aid', description: 'Scholarships and aid', category: 'fees', confidence: 85 }
          ]
        },
        {
          id: 'deadlines',
          label: 'Dates & Deadlines',
          description: 'Application deadlines and intake dates',
          icon: Calendar,
          selected: false,
          pages: [
            { url: `${websiteUrl}/calendar`, title: 'Academic Calendar', description: 'Important dates', category: 'deadlines', confidence: 80 },
            { url: `${websiteUrl}/deadlines`, title: 'Application Deadlines', description: 'When to apply', category: 'deadlines', confidence: 85 }
          ]
        },
        {
          id: 'general',
          label: 'General Info',
          description: 'About us, contact, and general information',
          icon: Users,
          selected: false,
          pages: [
            { url: `${websiteUrl}/about`, title: 'About Us', description: 'Institution information', category: 'general', confidence: 70 },
            { url: `${websiteUrl}/contact`, title: 'Contact', description: 'Contact information', category: 'general', confidence: 75 }
          ]
        }
      ];

      setCategories(mockCategories);
      updateEstimatedTime(mockCategories);
      setCurrentStep('selection');
      
      toast({
        title: "Pages Discovered!",
        description: `Found ${mockCategories.reduce((sum, cat) => sum + cat.pages.length, 0)} relevant pages across ${mockCategories.length} categories.`,
      });

    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Unable to analyze the website structure. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const updateEstimatedTime = (cats: PageCategory[]) => {
    const selectedPages = cats.filter(cat => cat.selected).reduce((sum, cat) => sum + cat.pages.length, 0);
    const customPages = customUrls.length;
    const totalPages = selectedPages + customPages;
    setEstimatedTime(Math.max(10, totalPages * 3)); // 3 seconds per page minimum
  };

  const toggleCategory = (categoryId: string) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId ? { ...cat, selected: !cat.selected } : cat
    );
    setCategories(updatedCategories);
    updateEstimatedTime(updatedCategories);
  };

  const applyPreset = (presetId: string) => {
    let updatedCategories = [...categories];
    
    switch (presetId) {
      case 'programs-only':
        updatedCategories = categories.map(cat => ({
          ...cat,
          selected: cat.id === 'programs'
        }));
        break;
      case 'admissions-focus':
        updatedCategories = categories.map(cat => ({
          ...cat,
          selected: ['programs', 'admissions', 'fees'].includes(cat.id)
        }));
        break;
      case 'full-academic':
        updatedCategories = categories.map(cat => ({
          ...cat,
          selected: cat.id !== 'general'
        }));
        break;
    }
    
    setCategories(updatedCategories);
    updateEstimatedTime(updatedCategories);
  };

  const addCustomUrl = () => {
    if (newCustomUrl && !customUrls.includes(newCustomUrl)) {
      setCustomUrls([...customUrls, newCustomUrl]);
      setNewCustomUrl('');
      updateEstimatedTime(categories);
    }
  };

  const removeCustomUrl = (url: string) => {
    setCustomUrls(customUrls.filter(u => u !== url));
    updateEstimatedTime(categories);
  };

  const startScan = async () => {
    const selectedPages = categories
      .filter(cat => cat.selected)
      .flatMap(cat => cat.pages);
    
    const allPages = [...selectedPages, ...customUrls.map(url => ({
      url,
      title: 'Custom Page',
      description: 'User-specified page',
      category: 'custom',
      confidence: 100
    }))];

    if (allPages.length === 0) {
      toast({
        title: "No Pages Selected",
        description: "Please select at least one category or add custom URLs.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep('scanning');
    setScanProgress({ current: 0, total: allPages.length, currentPage: '' });

    try {
      // Simulate scanning each page
      for (let i = 0; i < allPages.length; i++) {
        setScanProgress({
          current: i + 1,
          total: allPages.length,
          currentPage: allPages[i].title
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Mock scan results
      const mockResults = {
        url: websiteUrl,
        pagesScanned: allPages.length,
        programs: [
          {
            name: "Bachelor of Computer Science",
            description: "Comprehensive 4-year program covering software development, algorithms, and computer systems.",
            duration: "4 years",
            tuitionFee: "$45,000/year",
            applicationFee: "$100",
            requirements: ["High School Diploma", "SAT Score: 1200+", "Math Prerequisites"],
            intakes: ["Fall 2024", "Spring 2025"],
            sourcePages: [`${websiteUrl}/programs`, `${websiteUrl}/undergraduate`]
          },
          {
            name: "Master of Business Administration",
            description: "Advanced business program focusing on leadership, strategy, and innovation.",
            duration: "2 years", 
            tuitionFee: "$55,000/year",
            applicationFee: "$150",
            requirements: ["Bachelor's Degree", "GMAT Score: 550+", "Work Experience: 2+ years"],
            intakes: ["Fall 2024", "Spring 2025", "Summer 2025"],
            sourcePages: [`${websiteUrl}/programs`, `${websiteUrl}/graduate`]
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

      setScanResults(mockResults);
      setCurrentStep('results');
      
      toast({
        title: "Scan Complete!",
        description: `Successfully analyzed ${allPages.length} pages and found ${mockResults.programs.length} programs.`,
      });

    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to complete the scan. Please try again.",
        variant: "destructive"
      });
      setCurrentStep('selection');
    }
  };

  const handleConfirm = () => {
    if (scanResults) {
      onComplete({
        url: websiteUrl,
        scanResult: scanResults,
        detectedPrograms: scanResults.programs,
        institutionInfo: scanResults.generalInfo,
        contactInfo: scanResults.contactInfo,
        selectedCategories: categories.filter(cat => cat.selected).map(cat => cat.id),
        customUrls,
        rawScanData: scanResults
      });
      onNext();
    }
  };

  // Step 1: URL Entry
  if (currentStep === 'url') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Smart Website Analysis
          </h3>
          <p className="text-muted-foreground">
            Let's discover the most relevant pages on your website to scan for programs and information.
          </p>
        </div>

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
              <Button onClick={discoverPages} disabled={!websiteUrl || isDiscovering}>
                {isDiscovering ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-spin" />
                    Discovering...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Discover Pages
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll analyze your site structure and suggest the most relevant pages to scan.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={onSkip} className="glass-button">
            Skip Website Scan
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Page Selection
  if (currentStep === 'selection') {
    const selectedCount = categories.filter(cat => cat.selected).reduce((sum, cat) => sum + cat.pages.length, 0) + customUrls.length;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Select Pages to Scan
          </h3>
          <p className="text-muted-foreground">
            Choose which sections of your website to analyze. This focused approach is faster and more accurate.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {QUICK_PRESETS.map(preset => (
              <Button
                key={preset.id}
                variant="outline"
                onClick={() => applyPreset(preset.id)}
                className="h-auto p-3 text-left"
              >
                <div>
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Page Categories */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Page Categories</Label>
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className={`transition-all ${category.selected ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={category.selected}
                        onCheckedChange={() => toggleCategory(category.id)}
                      />
                      <IconComponent className="w-5 h-5 text-primary" />
                      <div>
                        <CardTitle className="text-base">{category.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{category.pages.length} pages</Badge>
                  </div>
                </CardHeader>
                {category.selected && (
                  <CardContent>
                    <div className="space-y-2">
                      {category.pages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{page.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{page.url}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {page.confidence}%
                            </Badge>
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Custom URLs */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Custom URLs</Label>
          <div className="flex space-x-2">
            <Input
              value={newCustomUrl}
              onChange={(e) => setNewCustomUrl(e.target.value)}
              placeholder="https://your-site.edu/specific-page"
              className="flex-1"
            />
            <Button onClick={addCustomUrl} disabled={!newCustomUrl}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {customUrls.length > 0 && (
            <div className="space-y-2">
              {customUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm truncate flex-1 min-w-0">{url}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCustomUrl(url)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedCount}</div>
                  <div className="text-xs text-muted-foreground">Pages Selected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{estimatedTime}s</div>
                  <div className="text-xs text-muted-foreground">Est. Time</div>
                </div>
              </div>
              <Button onClick={startScan} disabled={selectedCount === 0}>
                <Clock className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => setCurrentStep('url')}>
            Back to URL
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Scanning Progress
  if (currentStep === 'scanning') {
    const progress = (scanProgress.current / scanProgress.total) * 100;
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
            <Search className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Scanning Selected Pages
          </h3>
          <p className="text-muted-foreground">
            Analyzing your selected pages for programs, fees, and requirements...
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{scanProgress.current} of {scanProgress.total} pages</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {scanProgress.currentPage && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Currently scanning: <span className="font-medium">{scanProgress.currentPage}</span>
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This focused scan is much faster than analyzing entire websites.
          </p>
        </div>
      </div>
    );
  }

  // Step 4: Results
  if (currentStep === 'results' && scanResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-xl mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Scan Complete!
          </h3>
          <p className="text-muted-foreground">
            Successfully analyzed {scanResults.pagesScanned} pages and found {scanResults.programs.length} programs.
          </p>
        </div>

        {/* Results Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{scanResults.pagesScanned}</div>
                <div className="text-xs text-muted-foreground">Pages Scanned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{scanResults.programs.length}</div>
                <div className="text-xs text-muted-foreground">Programs Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{scanResults.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{estimatedTime}s</div>
                <div className="text-xs text-muted-foreground">Scan Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detected Programs Preview */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Detected Programs</h4>
          {scanResults.programs.slice(0, 2).map((program: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{program.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{program.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                {program.sourcePages && (
                  <div className="mt-3">
                    <Label className="text-muted-foreground">Source Pages</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {program.sourcePages.map((page: string, pageIndex: number) => (
                        <Badge key={pageIndex} variant="outline" className="text-xs">
                          {page.split('/').pop()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {scanResults.programs.length > 2 && (
            <p className="text-sm text-muted-foreground text-center">
              +{scanResults.programs.length - 2} more programs detected
            </p>
          )}
        </div>

        <div className="flex justify-center space-x-3">
          <Button variant="outline" onClick={() => setCurrentStep('selection')}>
            Scan More Pages
          </Button>
          <Button onClick={handleConfirm}>
            <Check className="w-4 h-4 mr-2" />
            Confirm & Continue
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default SelectiveWebsiteScanner;