-- Create OTP verifications table for secure storage
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '10 minutes'),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  verified_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for OTP verifications
CREATE POLICY "Users can create OTP verifications" 
ON public.otp_verifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can manage OTP verifications" 
ON public.otp_verifications 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_otp_verifications_email ON public.otp_verifications(email);
CREATE INDEX idx_otp_verifications_expires_at ON public.otp_verifications(expires_at);

-- Create function to cleanup expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.otp_verifications 
  WHERE expires_at < now() OR verified_at IS NOT NULL;
END;
$$;

-- Create rate limiting table
CREATE TABLE public.otp_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- email or IP
  limit_type TEXT NOT NULL, -- 'email' or 'ip'
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for rate limits
ALTER TABLE public.otp_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for rate limits
CREATE POLICY "System can manage rate limits" 
ON public.otp_rate_limits 
FOR ALL 
USING (true);

-- Create indexes for rate limiting
CREATE INDEX idx_otp_rate_limits_identifier ON public.otp_rate_limits(identifier, limit_type);
CREATE INDEX idx_otp_rate_limits_window ON public.otp_rate_limits(window_start);