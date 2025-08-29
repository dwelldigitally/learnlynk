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
import InstitutionReview from './InstitutionReview';

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
  const [currentStep, setCurrentStep] = useState<'url' | 'discovery' | 'selection' | 'scanning' | 'institution' | 'results'>('url');
  const [websiteUrl, setWebsiteUrl] = useState(data?.url || '');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [customUrls, setCustomUrls] = useState<string[]>([]);
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [scanProgress, setScanProgress] = useState<ScanProgress>({ current: 0, total: 0, currentPage: '' });
  const [scanResults, setScanResults] = useState<any>(null);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);

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

      if (mappedCategories.length === 0 || mappedCategories.every(cat => cat.pages.length === 0)) {
        // Enhanced fallback when discovery fails completely
        console.log('Discovery returned empty results, using enhanced fallback');
        
        const fallbackCategories: PageCategory[] = [
          {
            id: 'programs',
            label: 'Academic Programs',
            description: 'Degree programs, courses, and curricula',
            icon: GraduationCap,
            selected: true,
            pages: [
              { url: `${websiteUrl}/programs`, title: 'Academic Programs', description: 'Main programs page', category: 'programs', confidence: 50 },
              { url: `${websiteUrl}/academics`, title: 'Academics', description: 'Academic information', category: 'programs', confidence: 50 },
              { url: `${websiteUrl}/courses`, title: 'Courses', description: 'Course listings', category: 'programs', confidence: 50 },
              { url: `${websiteUrl}/study`, title: 'Study Options', description: 'Study programs', category: 'programs', confidence: 50 }
            ]
          },
          {
            id: 'admissions',
            label: 'Admissions Information',
            description: 'Application requirements and processes',
            icon: FileText,
            selected: true,
            pages: [
              { url: `${websiteUrl}/admissions`, title: 'Admissions', description: 'How to apply', category: 'admissions', confidence: 50 },
              { url: `${websiteUrl}/apply`, title: 'Apply Now', description: 'Application process', category: 'admissions', confidence: 50 },
              { url: `${websiteUrl}/requirements`, title: 'Entry Requirements', description: 'Admission requirements', category: 'admissions', confidence: 50 }
            ]
          },
          {
            id: 'fees',
            label: 'Tuition & Fees',
            description: 'Cost information and financial aid',
            icon: DollarSign,
            selected: false,
            pages: [
              { url: `${websiteUrl}/tuition`, title: 'Tuition & Fees', description: 'Cost information', category: 'fees', confidence: 50 },
              { url: `${websiteUrl}/fees`, title: 'Fees', description: 'Fee structure', category: 'fees', confidence: 50 },
              { url: `${websiteUrl}/financial-aid`, title: 'Financial Aid', description: 'Scholarships and aid', category: 'fees', confidence: 50 }
            ]
          }
        ];
        setCategories(fallbackCategories);
        updateEstimatedTime(fallbackCategories);
        
        toast({
          title: "Using Suggested Pages",
          description: "We couldn't find specific pages automatically, but we've suggested common educational pages. You can customize these below.",
          variant: "default"
        });
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
      
      // Enhanced fallback with more comprehensive suggestions
      const fallbackCategories: PageCategory[] = [
        {
          id: 'programs',
          label: 'Academic Programs',
          description: 'Degree programs, courses, and curricula', 
          icon: GraduationCap,
          selected: true,
          pages: [
            { url: `${websiteUrl}/programs`, title: 'Academic Programs', description: 'Main programs page', category: 'programs', confidence: 40 },
            { url: `${websiteUrl}/academics`, title: 'Academics', description: 'Academic information', category: 'programs', confidence: 40 },
            { url: `${websiteUrl}/courses`, title: 'Courses', description: 'Course listings', category: 'programs', confidence: 40 },
            { url: `${websiteUrl}/undergraduate`, title: 'Undergraduate', description: 'Bachelor programs', category: 'programs', confidence: 40 },
            { url: `${websiteUrl}/graduate`, title: 'Graduate', description: 'Master programs', category: 'programs', confidence: 40 }
          ]
        },
        {
          id: 'admissions',
          label: 'Admissions Information',
          description: 'Application requirements and processes',
          icon: FileText,
          selected: true,
          pages: [
            { url: `${websiteUrl}/admissions`, title: 'Admissions', description: 'How to apply', category: 'admissions', confidence: 40 },
            { url: `${websiteUrl}/apply`, title: 'Apply Now', description: 'Application process', category: 'admissions', confidence: 40 },
            { url: `${websiteUrl}/requirements`, title: 'Requirements', description: 'Entry requirements', category: 'admissions', confidence: 40 }
          ]
        },
        {
          id: 'fees',
          label: 'Tuition & Fees',
          description: 'Cost information and financial aid',
          icon: DollarSign,
          selected: false,
          pages: [
            { url: `${websiteUrl}/tuition`, title: 'Tuition & Fees', description: 'Cost information', category: 'fees', confidence: 40 },
            { url: `${websiteUrl}/fees`, title: 'Fees', description: 'Fee structure', category: 'fees', confidence: 40 }
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
    console.log('=== START SCAN DEBUG ===');
    console.log('Current step before scan:', currentStep);
    
    const selectedPages = categories
      .filter(cat => cat.selected)
      .flatMap(cat => cat.pages);
    
    const allUrls = [...selectedPages.map(page => page.url), ...customUrls];

    console.log('Selected categories:', categories.filter(cat => cat.selected).map(cat => cat.id));
    console.log('All URLs to scan:', allUrls);
    console.log('Categories state:', categories);

    if (allUrls.length === 0) {
      console.log('ERROR: No URLs selected for scanning');
      toast({
        title: "No Pages Selected",
        description: "Please select at least one category or add custom URLs.",
        variant: "destructive"
      });
      return;
    }

    // Reset state
    console.log('Setting scanning state...');
    setIsScanning(true);
    setScanError(null);
    setCurrentStep('scanning');
    setScanProgress({ current: 0, total: allUrls.length, currentPage: '' });
    setScanStatus('Initializing scan...');
    console.log('State set - currentStep should now be "scanning"');

    // Clear any existing progress interval
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }

    const timeoutMs = 5 * 60 * 1000; // 5 minute timeout
    let timeoutId: NodeJS.Timeout;

    try {
      console.log('Starting scan with URLs:', allUrls);
      
      toast({
        title: "Starting Scan",
        description: `Analyzing ${allUrls.length} pages. This may take a few minutes.`,
      });

      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Scan timed out after 5 minutes. Try selecting fewer pages or try again later.'));
        }, timeoutMs);
      });

      // Set up progress tracking
      setScanStatus('Scanning pages...');
      
      // Create scanning promise with progress tracking
      const scanPromise = (async () => {
        // Start progress updates
        let progressStep = 0;
        const interval = setInterval(() => {
          progressStep = (progressStep + 1) % allUrls.length;
          setScanProgress(prev => ({
            ...prev,
            current: Math.min(prev.current + 0.5, prev.total * 0.8), // Don't exceed 80% until done
            currentPage: `Analyzing: ${allUrls[progressStep]?.split('/').pop() || 'page'}`
          }));
        }, 2000);
        
        setProgressInterval(interval);

        try {
          const scanResult = await WebsiteScannerService.scanSpecificPages(allUrls);
          clearInterval(interval);
          return scanResult;
        } catch (error) {
          clearInterval(interval);
          throw error;
        }
      })();

      // Race between scan and timeout
      const scanResult = await Promise.race([scanPromise, timeoutPromise]);
      
      clearTimeout(timeoutId);
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }

      // Complete progress
      setScanProgress({ current: allUrls.length, total: allUrls.length, currentPage: 'Processing results...' });
      setScanStatus('Processing scan results...');
      
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
          institution: {
            name: scanResult.institution.name,
            description: scanResult.institution.description || "Educational institution providing quality programs and services.",
            website: websiteUrl,
            phone: scanResult.institution.phone,
            email: scanResult.institution.email,
            address: scanResult.institution.address,
            city: scanResult.institution.city,
            state: scanResult.institution.state,
            country: scanResult.institution.country,
            logo_url: scanResult.institution.logo_url,
            primary_color: scanResult.institution.primary_color,
            founded_year: scanResult.institution.founded_year,
            employee_count: scanResult.institution.employee_count
          },
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
        setCurrentStep('institution');
        
        toast({
          title: "Scan Complete!",
          description: `Successfully analyzed ${scanResult.pages_scanned} pages and found ${results.programs.length} programs.`,
        });
      } else {
        throw new Error(scanResult.error || 'Scan failed - no data returned');
      }

    } catch (error) {
      console.error('Scan error:', error);
      
      // Clear timeout and intervals
      clearTimeout(timeoutId!);
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }

      const errorMessage = error instanceof Error ? error.message : "Unable to complete the scan";
      setScanError(errorMessage);
      
      // Show different messages based on error type
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        toast({
          title: "Scan Timed Out",
          description: "The scan took too long. Try selecting fewer pages or try again later.",
          variant: "destructive"
        });
      } else if (errorMessage.includes('rate limit')) {
        toast({
          title: "Rate Limit Reached",
          description: "Too many requests. Please wait a few minutes and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Scan Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      setCurrentStep('selection');
    } finally {
      setIsScanning(false);
      setScanStatus('');
    }
  };

  const cancelScan = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    setIsScanning(false);
    setScanError(null);
    setCurrentStep('selection');
    toast({
      title: "Scan Cancelled",
      description: "The scan has been cancelled.",
    });
  };

  const retryScan = () => {
    setScanError(null);
    startScan();
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

  // Debug: Log current step on every render
  console.log('=== RENDER DEBUG ===');
  console.log('currentStep:', currentStep);
  console.log('isScanning:', isScanning);
  console.log('scanError:', scanError);
  console.log('scanResults?.institution:', scanResults?.institution);

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
          <Label className="text-sm font-medium">Add Custom URLs</Label>
          <p className="text-xs text-muted-foreground">
            Add specific pages you want to scan that weren't automatically discovered.
          </p>
          <div className="flex space-x-2">
            <Input
              value={newCustomUrl}
              onChange={(e) => setNewCustomUrl(e.target.value)}
              placeholder={`${websiteUrl}/custom-page`}
              className="flex-1"
            />
            <Button onClick={addCustomUrl} disabled={!newCustomUrl}>
              <Plus className="w-4 h-4 mr-1" />
              Add
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

        {/* Help Text for Empty Results */}
        {categories.length > 0 && categories.every(cat => cat.pages.length === 0) && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-amber-600 dark:text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  No pages discovered automatically
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  This can happen if your website has a unique structure. Try adding custom URLs above 
                  or check if your website uses different paths than expected.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {categories.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Ready to scan {selectedCount} pages across {categories.filter(cat => cat.selected).length} categories
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Estimated time: {estimatedTime} seconds
            </p>
          </div>
        )}

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
    const progress = Math.min((scanProgress.current / scanProgress.total) * 100, 100);
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
            <Search className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {scanError ? 'Scan Failed' : 'Scanning Selected Pages'}
          </h3>
          <p className="text-muted-foreground">
            {scanError ? 'There was an issue with the scan' : 'Analyzing your selected pages for programs, fees, and requirements...'}
          </p>
        </div>

        {scanError ? (
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <X className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive">
                    Scan Error
                  </h4>
                  <p className="text-sm text-destructive/80 mt-1">
                    {scanError}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <Button variant="outline" onClick={() => setCurrentStep('selection')}>
                Back to Selection
              </Button>
              <Button onClick={retryScan}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(scanProgress.current)} of {scanProgress.total} pages</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(progress, 5)}%` }}
                >
                  {progress > 20 && (
                    <span className="text-xs text-primary-foreground font-medium">
                      {Math.round(progress)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {scanProgress.currentPage && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{scanProgress.currentPage}</span>
                </p>
              </div>
            )}

            {scanStatus && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Status: {scanStatus}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button variant="outline" onClick={cancelScan} size="sm">
                Cancel Scan
              </Button>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {scanError 
              ? 'You can try again with fewer pages or different URLs'
              : 'This focused scan analyzes only your selected pages for faster results.'
            }
          </p>
        </div>
      </div>
    );
  }

  // Step 4: Institution Review
  if (currentStep === 'institution' && scanResults?.institution) {
    return (
      <InstitutionReview
        institution={scanResults.institution}
        onConfirm={(institution) => {
          setScanResults(prev => prev ? { ...prev, institution } : null);
          setCurrentStep('results');
        }}
        onEdit={() => setCurrentStep('selection')}
      />
    );
  }

  // Step 5: Results
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
          {scanResults.programs.slice(0, 3).map((program: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{program.name}</CardTitle>
                {program.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                )}
                {program.code && (
                  <Badge variant="outline" className="w-fit">{program.code}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p className="font-medium">{program.duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium capitalize">{program.type || 'Program'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Delivery</Label>
                    <p className="font-medium capitalize">{program.delivery_method || 'In-person'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                      {program.status || 'Active'}
                    </Badge>
                  </div>
                </div>

                {/* Fee Structure */}
                {(program.fee_structure?.domestic_fees?.length > 0 || program.fee_structure?.international_fees?.length > 0) && (
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-muted-foreground">Fees</Label>
                    <div className="mt-2 space-y-1">
                      {program.fee_structure.domestic_fees?.map((fee: any, feeIndex: number) => (
                        <div key={feeIndex} className="flex justify-between text-sm">
                          <span>{fee.type}: </span>
                          <span className="font-medium">{fee.currency} ${fee.amount}</span>
                        </div>
                      ))}
                      {program.fee_structure.international_fees?.map((fee: any, feeIndex: number) => (
                        <div key={feeIndex} className="flex justify-between text-sm">
                          <span>{fee.type} (Intl): </span>
                          <span className="font-medium">{fee.currency} ${fee.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {program.entry_requirements?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-muted-foreground">Entry Requirements</Label>
                    <div className="mt-2 space-y-1">
                      {program.entry_requirements.slice(0, 2).map((req: any, reqIndex: number) => (
                        <div key={reqIndex} className="text-sm">
                          <span className="font-medium">{req.title}:</span> {req.description}
                        </div>
                      ))}
                      {program.entry_requirements.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{program.entry_requirements.length - 2} more requirements
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Intake Dates */}
                {program.intake_dates?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-muted-foreground">Intake Dates</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {program.intake_dates.map((intake: string, intakeIndex: number) => (
                        <Badge key={intakeIndex} variant="outline" className="text-xs">
                          {intake}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {program.url && (
                  <div className="mt-3">
                    <Label className="text-muted-foreground">Source URL</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {new URL(program.url).pathname.split('/').pop() || 'Program Page'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {scanResults.programs.length > 3 && (
            <p className="text-sm text-muted-foreground text-center">
              +{scanResults.programs.length - 3} more programs detected
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