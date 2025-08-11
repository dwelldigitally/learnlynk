import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/modern/GlassCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
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
              Check Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent you a password reset link
            </p>
          </div>

          {/* Success Card */}
          <GlassCard className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Reset link sent!
                </h2>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Please check your email and click the reset link to create a new password. 
                  The link will expire in 1 hour for security.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/sign-in')}
                  className="w-full bg-primary hover:bg-primary-hover neo-button"
                >
                  Back to Sign In
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="w-full"
                >
                  Send to a different email
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
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
            Reset Your Password
          </h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a reset link
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
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@institution.edu"
                className="h-12 glass-button"
                required
              />
              <p className="text-sm text-muted-foreground">
                We'll send a password reset link to this email address
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-lg font-medium neo-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="loading-shimmer w-5 h-5 rounded-full mr-2" />
                  Sending reset link...
                </div>
              ) : (
                <>
                  Send Reset Link
                  <Mail className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/sign-in')}
            className="inline-flex items-center text-primary hover:text-primary-hover font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;