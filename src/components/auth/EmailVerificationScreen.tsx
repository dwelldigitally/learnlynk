import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const EmailVerificationScreen: React.FC = () => {
  const { user, resendConfirmation, refreshUser, signOut } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    try {
      const { error } = await resendConfirmation(user.email);
      if (error) {
        toast.error('Failed to resend verification email');
      } else {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      toast.error('An error occurred while sending the email');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
      toast.success('Checking verification status...');
    } catch (error) {
      toast.error('Failed to check verification status');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to {user?.email}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Please check your email and click the verification link to continue with onboarding.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={handleCheckVerification}
              disabled={isRefreshing}
              className="w-full"
            >
              {isRefreshing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              I've Verified My Email
            </Button>

            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Resend Verification Email
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Didn't receive the email?</p>
            <ul className="text-xs space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure {user?.email} is correct</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>

          <div className="pt-4 border-t text-center">
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-sm"
            >
              Sign out and try with a different email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};