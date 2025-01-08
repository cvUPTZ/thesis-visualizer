import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

interface TestResult {
  feature: string;
  status: 'success' | 'error' | 'pending';
  error?: string;
  duration?: number;
}

export const SystemTest = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const features = [
    { name: 'Authentication', test: testAuthentication },
    { name: 'Thesis Creation', test: testThesisCreation },
    { name: 'Citation Management', test: testCitationManagement },
    { name: 'Collaboration', test: testCollaboration },
    { name: 'Review System', test: testReviewSystem }
  ];

  async function testAuthentication(): Promise<TestResult> {
    console.log('Testing authentication...');
    try {
      const startTime = performance.now();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      const duration = performance.now() - startTime;
      return {
        feature: 'Authentication',
        status: 'success',
        duration
      };
    } catch (error: any) {
      console.error('Authentication test failed:', error);
      await reportIssue('Authentication', error);
      return {
        feature: 'Authentication',
        status: 'error',
        error: error.message
      };
    }
  }

  async function testThesisCreation(): Promise<TestResult> {
    console.log('Testing thesis creation...');
    try {
      const startTime = performance.now();
      
      // Test thesis table access
      const { error: thesisError } = await supabase
        .from('theses')
        .select('*')
        .limit(1);

      if (thesisError) throw thesisError;

      const duration = performance.now() - startTime;
      return {
        feature: 'Thesis Creation',
        status: 'success',
        duration
      };
    } catch (error: any) {
      console.error('Thesis creation test failed:', error);
      await reportIssue('Thesis Creation', error);
      return {
        feature: 'Thesis Creation',
        status: 'error',
        error: error.message
      };
    }
  }

  async function testCitationManagement(): Promise<TestResult> {
    console.log('Testing citation management...');
    try {
      const startTime = performance.now();
      
      // Test citations table access
      const { error: citationError } = await supabase
        .from('citations')
        .select('*')
        .limit(1);

      if (citationError) throw citationError;

      const duration = performance.now() - startTime;
      return {
        feature: 'Citation Management',
        status: 'success',
        duration
      };
    } catch (error: any) {
      console.error('Citation management test failed:', error);
      await reportIssue('Citation Management', error);
      return {
        feature: 'Citation Management',
        status: 'error',
        error: error.message
      };
    }
  }

  async function testCollaboration(): Promise<TestResult> {
    console.log('Testing collaboration features...');
    try {
      const startTime = performance.now();
      
      // Test collaborators table access
      const { error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .select('*')
        .limit(1);

      if (collaboratorError) throw collaboratorError;

      const duration = performance.now() - startTime;
      return {
        feature: 'Collaboration',
        status: 'success',
        duration
      };
    } catch (error: any) {
      console.error('Collaboration test failed:', error);
      await reportIssue('Collaboration', error);
      return {
        feature: 'Collaboration',
        status: 'error',
        error: error.message
      };
    }
  }

  async function testReviewSystem(): Promise<TestResult> {
    console.log('Testing review system...');
    try {
      const startTime = performance.now();
      
      // Test reviews table access
      const { error: reviewError } = await supabase
        .from('thesis_reviews')
        .select('*')
        .limit(1);

      if (reviewError) throw reviewError;

      const duration = performance.now() - startTime;
      return {
        feature: 'Review System',
        status: 'success',
        duration
      };
    } catch (error: any) {
      console.error('Review system test failed:', error);
      await reportIssue('Review System', error);
      return {
        feature: 'Review System',
        status: 'error',
        error: error.message
      };
    }
  }

  async function reportIssue(component: string, error: any) {
    console.log('Reporting issue for component:', component, error);
    try {
      const { error: reportError } = await supabase
        .from('app_issues')
        .insert([{
          component_name: component,
          error_message: error.message,
          error_stack: error.stack,
          browser_info: navigator.userAgent,
          route_path: window.location.pathname
        }]);

      if (reportError) {
        console.error('Failed to report issue:', reportError);
      }
    } catch (err) {
      console.error('Error reporting issue:', err);
    }
  }

  const runTests = async () => {
    console.log('Starting system tests...');
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const totalTests = features.length;
    let completedTests = 0;

    for (const feature of features) {
      const result = await feature.test();
      setResults(prev => [...prev, result]);
      completedTests++;
      setProgress((completedTests / totalTests) * 100);
    }

    setIsRunning(false);
    toast({
      title: "Tests Completed",
      description: `${results.filter(r => r.status === 'success').length} of ${totalTests} tests passed`,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Test Dashboard</span>
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </CardTitle>
        {isRunning && (
          <Progress value={progress} className="w-full" />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-3">
              {result.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : result.status === 'error' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <h3 className="font-medium">{result.feature}</h3>
                {result.error && (
                  <p className="text-sm text-destructive">{result.error}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {result.duration && (
                <Badge variant="secondary">
                  {result.duration.toFixed(0)}ms
                </Badge>
              )}
              <Badge
                variant={
                  result.status === 'success'
                    ? 'secondary'
                    : result.status === 'error'
                    ? 'destructive'
                    : 'default'
                }
              >
                {result.status}
              </Badge>
            </div>
          </div>
        ))}
        {!isRunning && results.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Click "Run Tests" to start system diagnostics
          </div>
        )}
      </CardContent>
    </Card>
  );
};
