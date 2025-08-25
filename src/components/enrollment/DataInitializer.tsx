import React, { useEffect, useState } from 'react';
import { enrollmentSeedService } from '@/services/enrollmentSeedService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DataInitializerProps {
  children: React.ReactNode;
}

export function DataInitializer({ children }: DataInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if data already exists to avoid re-seeding
        const { data: existingActions } = await supabase
          .from('action_queue')
          .select('id')
          .limit(1);

        if (!existingActions || existingActions.length === 0) {
          console.log('Initializing enrollment optimization data...');
          await enrollmentSeedService.seedAll();
          
          toast({
            title: "Data Initialized",
            description: "Enrollment optimization data has been loaded successfully",
          });
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsInitialized(true); // Still show the app even if seeding fails
        
        toast({
          title: "Initialization Warning",
          description: "Some demo data may not be available",
          variant: "destructive"
        });
      }
    };

    initializeData();
  }, [toast]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Initializing enrollment optimization data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}