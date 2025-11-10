import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // No onboarding/setup state tracking - users have full access

  // Show loading only when auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user email is verified using Supabase's built-in confirmation
  if (!user.email_confirmed_at) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check role-based access - only admins can access /admin routes
  const isAdmin = user.user_metadata?.user_role === 'admin';
  if (!isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};