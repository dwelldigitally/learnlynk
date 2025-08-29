import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const OTPVerificationScreen: React.FC = () => {
  const { user, refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Send OTP on component mount
  useEffect(() => {
    if (user?.email) {
      sendOTP();
    }
  }, [user?.email]);

  const sendOTP = async () => {
    if (!user?.email) return;
    
    setIsResending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { 
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.first_name
        }
      });

      if (error) throw error;

      if (data?.success) {
        setTimeLeft(600); // Reset timer
        setRemainingAttempts(5); // Reset attempts
        setCanResend(false);
        toast.success(data.message || 'Verification code sent to your email!');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      if (error.message?.includes('Too many')) {
        toast.error(error.message);
        setCanResend(false);
        setTimeLeft(3600); // 1 hour for rate limit
      } else {
        toast.error('Failed to send verification code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    if (!user?.email) {
      toast.error('No email found. Please try signing up again.');
      return;
    }

    setIsVerifying(true);
    try {
      // Verify OTP using secure backend function
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email: user.email, otp }
      });

      if (error) throw error;

      if (data?.success) {
        // Mark email as verified in Supabase
        const { error: updateError } = await supabase.auth.updateUser({
          data: { email_verified: true }
        });

        if (updateError) throw updateError;

        toast.success('Email verified successfully!');
        
        // Refresh user data and navigate to onboarding
        await refreshUser();
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      if (error.message?.includes('Invalid OTP')) {
        const remaining = error.remainingAttempts ?? remainingAttempts - 1;
        setRemainingAttempts(remaining);
        setOtp(''); // Clear the input
        
        if (remaining === 0) {
          setCanResend(true);
          toast.error('Maximum attempts exceeded. Please request a new code.');
        } else {
          toast.error(`Invalid code. ${remaining} attempts remaining.`);
        }
      } else if (error.message?.includes('expired') || error.message?.includes('Maximum')) {
        setCanResend(true);
        toast.error(error.message);
      } else {
        toast.error(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-up');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      verifyOTP();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {user?.email}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleOtpChange}
              onKeyPress={handleKeyPress}
              className="text-center text-xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          {timeLeft > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Code expires in {formatTime(timeLeft)}
            </div>
          )}

          {remainingAttempts < 5 && remainingAttempts > 0 && (
            <Alert>
              <AlertDescription className="text-amber-600">
                {remainingAttempts} verification attempts remaining
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Please check your email for the verification code. Don't forget to check your spam folder.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={verifyOTP}
              disabled={isVerifying || otp.length !== 6 || remainingAttempts === 0}
              className="w-full"
            >
              {isVerifying && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>

            <Button 
              variant="outline" 
              onClick={sendOTP}
              disabled={isResending || (timeLeft > 540 && !canResend)} // Allow resend if rate limited or attempts exceeded
              className="w-full"
            >
              {isResending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Resend Code
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Having trouble?</p>
            <ul className="text-xs space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure {user?.email} is correct</li>
              <li>• Wait a few minutes for email delivery</li>
            </ul>
          </div>

          <div className="pt-4 border-t text-center space-y-2">
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};