import { supabase } from '@/integrations/supabase/client';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

class SupabaseWrapper {
  private static instance: SupabaseWrapper;
  private refreshInProgress = false;
  private requestQueue: Array<() => void> = [];

  private constructor() {}

  static getInstance(): SupabaseWrapper {
    if (!SupabaseWrapper.instance) {
      SupabaseWrapper.instance = new SupabaseWrapper();
    }
    return SupabaseWrapper.instance;
  }

  private async waitForTokenRefresh(): Promise<void> {
    if (!this.refreshInProgress) return;
    
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
    });
  }

  private async refreshSessionInternal(): Promise<boolean> {
    if (this.refreshInProgress) {
      await this.waitForTokenRefresh();
      return true;
    }

    this.refreshInProgress = true;
    
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        console.error('Session refresh failed:', error);
        return false;
      }
      
      // Wait for token propagation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    } finally {
      this.refreshInProgress = false;
      // Process queued requests
      this.requestQueue.forEach(resolve => resolve());
      this.requestQueue = [];
    }
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const { maxRetries = 3, retryDelay = 1000, exponentialBackoff = true } = options;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForTokenRefresh();
        return await operation();
      } catch (error: any) {
        const isAuthError = error?.code === 'PGRST301' || 
                           error?.message?.includes('JWT expired') ||
                           error?.message?.includes('invalid JWT') ||
                           error?.message?.includes('token has invalid claims');

        if (isAuthError && attempt < maxRetries) {
          console.log(`Auth error on attempt ${attempt + 1}, refreshing session...`);
          
          const refreshSuccess = await this.refreshSessionInternal();
          
          if (refreshSuccess) {
            const delay = exponentialBackoff 
              ? retryDelay * Math.pow(2, attempt)
              : retryDelay;
            
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  // Simple retry wrapper for operations
  async retryOperation<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    return this.withRetry(operation, options);
  }
}

export const supabaseWrapper = SupabaseWrapper.getInstance();