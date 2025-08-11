import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/modern/GlassCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPassword: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have the proper hash fragments for password reset
  useEffect(() => {
    const hash = location.hash;
    if (!hash.includes('access_token') || !hash.includes('type=recovery')) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, [location]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <img 
                src="/lovable-uploads/48c3582c-ccc2-44ba-a7b2-4baa993dc1d8.png" 
                alt="Learnlynk Logo" 
                className="h-10"
              />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Password Updated!
            </h1>
            <p className="text-muted-foreground">
              Your password has been successfully updated
            </p>
          </div>

          {/* Success Card */}
          <GlassCard className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  All set!
                </h2>
                <p className="text-muted-foreground">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  You will be automatically redirected to the sign-in page in a few seconds.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => navigate('/sign-in')}
                className="w-full bg-primary hover:bg-primary-hover neo-button"
              >
                Continue to Sign In
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img 
              src="/lovable-uploads/48c3582c-ccc2-44ba-a7b2-4baa993dc1d8.png" 
              alt="Learnlynk Logo" 
              className="h-10"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Password
          </h1>
          <p className="text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {/* Reset Form */}
        <GlassCard className="p-8">
          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 glass-button pr-12"
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
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Password must include:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                  <li className={/(?=.*[a-z])/.test(password) ? 'text-green-600' : ''}>One lowercase letter</li>
                  <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-600' : ''}>One uppercase letter</li>
                  <li className={/(?=.*\d)/.test(password) ? 'text-green-600' : ''}>One number</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 glass-button pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-lg font-medium neo-button"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="loading-shimmer w-5 h-5 rounded-full mr-2" />
                  Updating password...
                </div>
              ) : (
                <>
                  Update Password
                  <Lock className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default ResetPassword;