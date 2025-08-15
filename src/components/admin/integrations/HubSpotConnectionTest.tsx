import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, TestTube } from 'lucide-react';

export const HubSpotConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    edgeFunction: boolean | null;
    authentication: boolean | null;
    database: boolean | null;
    oauth: boolean | null;
  }>({
    edgeFunction: null,
    authentication: null,
    database: null,
    oauth: null
  });

  const runTests = async () => {
    setTesting(true);
    const newResults = {
      edgeFunction: null,
      authentication: null,
      database: null,
      oauth: null
    };

    try {
      // Test 1: Edge Function Connectivity
      console.log('🧪 Test 1: Edge Function Connectivity');
      try {
        const { data, error } = await supabase.functions.invoke('hubspot-oauth/test');
        newResults.edgeFunction = !error && data?.status === 'ok';
        console.log('✅ Edge function test:', newResults.edgeFunction ? 'PASS' : 'FAIL');
      } catch (error) {
        console.error('❌ Edge function test failed:', error);
        newResults.edgeFunction = false;
      }

      // Test 2: Authentication
      console.log('🧪 Test 2: Authentication');
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        newResults.authentication = !error && !!user;
        console.log('✅ Authentication test:', newResults.authentication ? 'PASS' : 'FAIL');
      } catch (error) {
        console.error('❌ Authentication test failed:', error);
        newResults.authentication = false;
      }

      // Test 3: Database Access
      console.log('🧪 Test 3: Database Access');
      if (newResults.authentication) {
        try {
          const { error } = await supabase
            .from('hubspot_connections')
            .select('id')
            .limit(1);
          newResults.database = !error;
          console.log('✅ Database test:', newResults.database ? 'PASS' : 'FAIL');
        } catch (error) {
          console.error('❌ Database test failed:', error);
          newResults.database = false;
        }
      } else {
        newResults.database = false;
      }

      // Test 4: OAuth Configuration
      console.log('🧪 Test 4: OAuth Configuration');
      if (newResults.edgeFunction && newResults.authentication) {
        try {
          const { data, error } = await supabase.functions.invoke('hubspot-oauth', {
            method: 'GET'
          });
          newResults.oauth = !error && !!data?.authUrl;
          console.log('✅ OAuth config test:', newResults.oauth ? 'PASS' : 'FAIL');
        } catch (error) {
          console.error('❌ OAuth config test failed:', error);
          newResults.oauth = false;
        }
      } else {
        newResults.oauth = false;
      }

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      setResults(newResults);
      setTesting(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <div className="w-4 h-4" />;
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Not Tested</Badge>;
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "PASS" : "FAIL"}
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="w-5 h-5" />
        <h3 className="text-lg font-semibold">HubSpot Integration Tests</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(results.edgeFunction)}
            <span>Edge Function Connectivity</span>
          </div>
          {getStatusBadge(results.edgeFunction)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(results.authentication)}
            <span>User Authentication</span>
          </div>
          {getStatusBadge(results.authentication)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(results.database)}
            <span>Database Access</span>
          </div>
          {getStatusBadge(results.database)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(results.oauth)}
            <span>OAuth Configuration</span>
          </div>
          {getStatusBadge(results.oauth)}
        </div>
      </div>

      <Button 
        onClick={runTests} 
        disabled={testing}
        className="w-full"
      >
        {testing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Running Tests...
          </>
        ) : (
          <>
            <TestTube className="w-4 h-4 mr-2" />
            Run Diagnostic Tests
          </>
        )}
      </Button>
    </Card>
  );
};