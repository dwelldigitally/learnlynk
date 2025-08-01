import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/modern/GlassCard';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Building, 
  Users, 
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';

const ModernOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    institutionType: '',
    studentCount: '',
    primaryGoals: [] as string[],
    departments: '',
    integrations: [] as string[]
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/admin');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
          <Building className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tell us about your institution
        </h2>
        <p className="text-muted-foreground">
          Help us customize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Institution Type</Label>
          <div className="grid grid-cols-2 gap-3">
            {['University', 'College', 'Community College', 'Trade School'].map((type) => (
              <button
                key={type}
                onClick={() => handleInputChange('institutionType', type)}
                className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                  formData.institutionType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Approximate Student Count</Label>
          <div className="grid grid-cols-2 gap-3">
            {['< 1,000', '1,000 - 5,000', '5,000 - 15,000', '15,000+'].map((count) => (
              <button
                key={count}
                onClick={() => handleInputChange('studentCount', count)}
                className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                  formData.studentCount === count
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-xl mb-4">
          <BarChart3 className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          What are your primary goals?
        </h2>
        <p className="text-muted-foreground">
          Select all that apply to help us prioritize features
        </p>
      </div>

      <div className="space-y-3">
        {[
          'Streamline admissions process',
          'Improve student retention',
          'Enhance communication',
          'Better data analytics',
          'Automate administrative tasks',
          'Increase enrollment'
        ].map((goal) => (
          <button
            key={goal}
            onClick={() => toggleArrayValue('primaryGoals', goal)}
            className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
              formData.primaryGoals.includes(goal)
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border hover:border-accent/50 text-muted-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{goal}</span>
              {formData.primaryGoals.includes(goal) && (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Department Configuration
        </h2>
        <p className="text-muted-foreground">
          Set up your organizational structure
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="departments" className="text-foreground font-medium">
            Number of Departments
          </Label>
          <Input
            id="departments"
            type="number"
            value={formData.departments}
            onChange={(e) => handleInputChange('departments', e.target.value)}
            placeholder="e.g., 12"
            className="glass-button"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            Key Departments (Select main ones)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Admissions',
              'Registrar',
              'Financial Aid',
              'Student Services',
              'Academic Affairs',
              'IT Department'
            ].map((dept) => (
              <button
                key={dept}
                onClick={() => toggleArrayValue('departments', dept)}
                className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                  formData.departments.includes(dept)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-xl mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          You're all set!
        </h2>
        <p className="text-muted-foreground">
          Your personalized dashboard is ready
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          {[
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track key metrics and performance' },
            { icon: Users, title: 'Student Management', desc: 'Comprehensive student records' },
            { icon: Settings, title: 'System Configuration', desc: 'Customize your workflow' },
            { icon: Zap, title: 'Automation Tools', desc: 'Streamline repetitive tasks' }
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{feature.title}</div>
                <div className="text-sm text-muted-foreground">{feature.desc}</div>
              </div>
              <CheckCircle className="w-5 h-5 text-success ml-auto" />
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="text-sm font-medium text-primary mb-1">
            Next Steps:
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Invite your team members</li>
            <li>• Import existing student data</li>
            <li>• Configure admission forms</li>
            <li>• Set up notification preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img 
              src="/lovable-uploads/48c3582c-ccc2-44ba-a7b2-4baa993dc1d8.png" 
              alt="Learnlynk Logo" 
              className="h-10"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index + 1 <= currentStep ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <GlassCard className="p-8 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </GlassCard>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="glass-button"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary-hover neo-button"
          >
            {currentStep === totalSteps ? 'Enter Dashboard' : 'Continue'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernOnboarding;