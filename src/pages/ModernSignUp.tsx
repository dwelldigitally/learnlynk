import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/modern/GlassCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, User, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ModernSignUp: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userRole, setUserRole] = useState<'admin' | 'student' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    institutionName: '',
    studentId: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelection = (role: 'admin' | 'student') => {
    setUserRole(role);
    setCurrentStep(2);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    if (userRole === 'admin' && !formData.institutionName) {
      setError('Institution name is required for admin accounts');
      setIsLoading(false);
      return;
    }

    try {
      const metadata = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_role: userRole,
        institution_name: formData.institutionName,
        student_id: formData.studentId
      };

      const { error } = await signUp(formData.email, formData.password, metadata);
      
      if (error) {
        setError(error.message);
      } else {
        // Show success message and redirect to onboarding
        navigate('/onboarding');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Your Role
        </h2>
        <p className="text-muted-foreground">
          Select how you'll be using Learnlynk
        </p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => handleRoleSelection('admin')}
          className="p-6 border-2 border-border rounded-xl hover:border-primary transition-colors text-left group glass-button"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Institution Administrator
              </h3>
              <p className="text-muted-foreground text-sm">
                Manage admissions, students, programs, and institutional operations
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleRoleSelection('student')}
          className="p-6 border-2 border-border rounded-xl hover:border-primary transition-colors text-left group glass-button"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Student
              </h3>
              <p className="text-muted-foreground text-sm">
                Access your applications, academic records, and student services
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Create Your Account
        </h2>
        <p className="text-muted-foreground">
          {userRole === 'admin' ? 'Set up your institution account' : 'Set up your student account'}
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="John"
              className="glass-button"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Doe"
              className="glass-button"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={userRole === 'admin' ? 'admin@institution.edu' : 'student@institution.edu'}
            className="glass-button"
            required
          />
        </div>

        {userRole === 'admin' && (
          <div className="space-y-2">
            <Label htmlFor="institutionName" className="text-foreground font-medium">
              Institution Name *
            </Label>
            <Input
              id="institutionName"
              value={formData.institutionName}
              onChange={(e) => handleInputChange('institutionName', e.target.value)}
              placeholder="University of Excellence"
              className="glass-button"
              required
            />
          </div>
        )}

        {userRole === 'student' && (
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-foreground font-medium">
              Student ID (Optional)
            </Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              placeholder="ST2024001"
              className="glass-button"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-medium">
            Password *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              className="glass-button pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            className="mt-1 rounded border-border"
            required
          />
          <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground leading-relaxed">
            I agree to the <button type="button" className="text-primary hover:underline">Terms of Service</button> and{' '}
            <button type="button" className="text-primary hover:underline">Privacy Policy</button>
          </label>
        </div>

        <div className="flex space-x-3">
          <Button 
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="flex-1 glass-button"
          >
            Back
          </Button>
          <Button 
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-hover neo-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="loading-shimmer w-4 h-4 rounded-full mr-2" />
                Creating...
              </div>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img 
              src="/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png" 
              alt="Learnlynk Logo" 
              className="h-10"
            />
            <span className="text-2xl font-bold text-foreground">Learnlynk</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join Learnlynk
          </h1>
          <p className="text-muted-foreground">
            Transform your educational experience today
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${currentStep >= 1 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors ${currentStep >= 2 ? 'bg-primary' : 'bg-border'}`} />
          </div>
        </div>

        {/* Form */}
        <GlassCard className="p-8">
          {currentStep === 1 ? renderStepOne() : renderStepTwo()}
        </GlassCard>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/sign-in')}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernSignUp;