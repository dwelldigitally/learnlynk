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
import { WebsiteScannerService } from '@/services/websiteScanner';

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
      console.log('Discovering site structure for:', websiteUrl);
      
      // Show a toast indicating we're using real web scraping
      toast({
        title: "Analyzing Website",
        description: "Using AI to discover and categorize your website pages...",
      });
      
      const { categories: discoveredCategories } = await WebsiteScannerService.discoverSiteStructure(websiteUrl);
      
      // Map to our category structure with icons
      const iconMap = {
        'programs': GraduationCap,
        'admissions': FileText,
        'fees': DollarSign,
        'deadlines': Calendar,
        'general': Users
      };

      const mappedCategories: PageCategory[] = discoveredCategories.map(cat => ({
        id: cat.id,
        label: cat.label,
        description: cat.description,
        icon: iconMap[cat.id as keyof typeof iconMap] || FileText,
        pages: cat.pages.map(page => ({
          ...page,
          category: cat.id
        })),
        selected: ['programs', 'admissions', 'fees'].includes(cat.id) // Auto-select most important categories
      }));

      if (mappedCategories.length === 0) {
        // Fallback categories if discovery fails
        const fallbackCategories: PageCategory[] = [
          {
            id: 'programs',
            label: 'Academic Programs',
            description: 'Degree programs, courses, and curricula',
            icon: GraduationCap,
            selected: true,
            pages: [
              { url: `${websiteUrl}/programs`, title: 'Academic Programs', description: 'Main programs page', category: 'programs', confidence: 60 },
              { url: `${websiteUrl}/academics`, title: 'Academics', description: 'Academic information', category: 'programs', confidence: 60 }
            ]
          }
        ];
        setCategories(fallbackCategories);
        updateEstimatedTime(fallbackCategories);
      } else {
        setCategories(mappedCategories);
        updateEstimatedTime(mappedCategories);
      }

      setCurrentStep('selection');
      
      toast({
        title: "Pages Discovered!",
        description: `Found ${mappedCategories.reduce((sum, cat) => sum + cat.pages.length, 0)} relevant pages across ${mappedCategories.length} categories.`,
      });

    } catch (error) {
      console.error('Page discovery error:', error);
      toast({
        title: "Discovery Failed", 
        description: "Unable to analyze the website structure. Using fallback options.",
        variant: "destructive"
      });
      
      // Provide fallback categories
      const fallbackCategories: PageCategory[] = [
        {
          id: 'programs',
          label: 'Academic Programs',
          description: 'Degree programs, courses, and curricula', 
          icon: GraduationCap,
          selected: true,
          pages: [
            { url: `${websiteUrl}/programs`, title: 'Academic Programs', description: 'Main programs page', category: 'programs', confidence: 50 },
            { url: `${websiteUrl}/academics`, title: 'Academics', description: 'Academic information', category: 'programs', confidence: 50 }
          ]
        }
      ];
      setCategories(fallbackCategories);
      updateEstimatedTime(fallbackCategories);
      setCurrentStep('selection');
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
    
    const allUrls = [...selectedPages.map(page => page.url), ...customUrls];

    if (allUrls.length === 0) {
      toast({
        title: "No Pages Selected",
        description: "Please select at least one category or add custom URLs.",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep('scanning');
    setScanProgress({ current: 0, total: allUrls.length, currentPage: '' });

    try {
      console.log('Starting real scan with URLs:', allUrls);
      
      // Update progress periodically during scan
      const progressInterval = setInterval(() => {
        setScanProgress(prev => ({
          ...prev,
          current: Math.min(prev.current + 1, prev.total),
          currentPage: `Scanning page ${Math.min(prev.current + 1, prev.total)}/${prev.total}`
        }));
      }, 1000);

      // Perform real scan using WebsiteScannerService
      const scanResult = await WebsiteScannerService.scanSpecificPages(allUrls);
      
      clearInterval(progressInterval);
      
      if (scanResult.success) {
        const results = {
          url: websiteUrl,
          pagesScanned: scanResult.pages_scanned,
          programs: scanResult.programs.map(program => ({
            name: program.name,
            description: program.description,
            duration: program.duration,
            tuitionFee: program.fee_structure?.domestic_fees?.[0] ? 
              `${program.fee_structure.domestic_fees[0].currency} ${program.fee_structure.domestic_fees[0].amount}` : 
              'Contact for pricing',
            applicationFee: program.fee_structure?.domestic_fees?.find(fee => fee.type === 'application')?.amount ? 
              `${program.fee_structure.domestic_fees.find(fee => fee.type === 'application')?.currency} ${program.fee_structure.domestic_fees.find(fee => fee.type === 'application')?.amount}` :
              'Contact for details',
            requirements: program.entry_requirements.map(req => req.title),
            intakes: program.intake_dates,
            sourcePages: allUrls.filter(url => url.includes('program') || url.includes('academic'))
          })),
          generalInfo: {
            institutionName: scanResult.institution.name,
            accreditation: "Accredited Institution",
            established: scanResult.institution.founded_year?.toString() || "Established Institution",
            studentBody: scanResult.institution.employee_count ? `${scanResult.institution.employee_count}+ staff` : "Active student body"
          },
          contactInfo: {
            phone: scanResult.institution.phone || "Contact via website",
            email: scanResult.institution.email || "Contact via website", 
            address: scanResult.institution.address || `${scanResult.institution.city || ''}, ${scanResult.institution.state || ''}, ${scanResult.institution.country || ''}`.replace(/^,\s*|,\s*$/g, '') || "Contact for address"
          },
          confidence: Math.round((scanResult.urls_successfully_scraped || 0) / allUrls.length * 100),
          rawScanData: scanResult
        };

        setScanResults(results);
        setCurrentStep('results');
        
        toast({
          title: "Scan Complete!",
          description: `Successfully analyzed ${scanResult.pages_scanned} pages and found ${results.programs.length} programs.`,
        });
      } else {
        throw new Error(scanResult.error || 'Scan failed');
      }

    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Unable to complete the scan. Please try again.",
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-xl mb-4">
            <Check className="w-8 h-8 text-green-500" />
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