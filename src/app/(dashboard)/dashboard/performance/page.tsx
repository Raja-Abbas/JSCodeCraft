'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CodeEditor from '@/components/code-editor';
import {
  Gauge,
  Play,
  Loader2,
  FileCode2,
  Clock,
  HardDrive,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  issues: { name: string; description: string; severity: 'high' | 'medium' | 'low' }[];
  suggestions: { title: string; description: string; impact: 'high' | 'medium' | 'low' }[];
}

const sampleCode = `// Paste your JavaScript code here for analysis
// Or try the sample code below:

function findDuplicates(arr) {
  let duplicates = [];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  
  return duplicates;
}

function processItems(items) {
  return items
    .filter(item => item.active)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now()
    }))
    .filter(item => item.value > 0)
    .map(item => item.name);
}

function buildString(items) {
  let result = "";
  for (let i = 0; i < items.length; i++) {
    result += items[i] + ", ";
  }
  return result;
}`;

function analyzePerformance(code: string): ComplexityResult {
  const issues: ComplexityResult['issues'] = [];
  const suggestions: ComplexityResult['suggestions'] = [];
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';

  // Check for nested loops
  const nestedLoopRegex = /for\s*\([^)]+\)\s*\{[^}]*for\s*\([^)]+\)\s*\{/g;
  const tripleLoopRegex = /for\s*\([^)]+\)\s*\{[^}]*for\s*\([^)]+\)\s*\{[^}]*for\s*\([^)]+\)\s*\{/g;

  if (tripleLoopRegex.test(code)) {
    timeComplexity = 'O(n³)';
    issues.push({
      name: 'Triple Nested Loops',
      description: 'Detected three levels of nested loops resulting in O(n³) complexity.',
      severity: 'high',
    });
    suggestions.push({
      title: 'Flatten with hash map',
      description: 'Consider using a hash map or Set to reduce nested iterations.',
      impact: 'high',
    });
  } else if (nestedLoopRegex.test(code)) {
    timeComplexity = 'O(n²)';
    issues.push({
      name: 'Nested Loops',
      description: 'Detected nested loops resulting in O(n²) complexity.',
      severity: 'medium',
    });
    suggestions.push({
      title: 'Use hash map lookup',
      description: 'Replace inner loop with a Map or Set for O(1) lookups.',
      impact: 'high',
    });
  }

  // Check for array operations
  if (/\.map\s*\(/.test(code)) {
    spaceComplexity = 'O(n)';
  }
  if (/\.filter\s*\(/.test(code) && /\.map\s*\(/.test(code)) {
    issues.push({
      name: 'Chained Array Operations',
      description: 'Multiple map/filter chains iterate the array multiple times.',
      severity: 'medium',
    });
    suggestions.push({
      title: 'Combine operations',
      description: 'Use reduce() to perform multiple transformations in a single pass.',
      impact: 'medium',
    });
  }

  // String concatenation in loops
  if (/\+\=\s*["']/.test(code) || /\+\=\s*\w+\[/.test(code)) {
    issues.push({
      name: 'String Concatenation in Loop',
      description: 'String concatenation with += creates new strings each iteration.',
      severity: 'medium',
    });
    suggestions.push({
      title: 'Use array.join()',
      description: 'Collect strings in an array and use .join() for better performance.',
      impact: 'medium',
    });
  }

  // Check for unnecessary spread in loops
  if (/\.\.\.(?!props|rest|args)/.test(code) && /for\s*\(/.test(code)) {
    issues.push({
      name: 'Spread Operator in Loop',
      description: 'Object spread in loops creates new objects each iteration.',
      severity: 'low',
    });
  }

  // Check for memoization opportunities
  if (/function\s+\w+\s*\([^)]*\)\s*\{[^}]*if\s*\([^)]*===?\s*[^)]*\)\s*return/.test(code)) {
    suggestions.push({
      title: 'Add memoization',
      description: 'This function has repetitive calls - consider adding a cache.',
      impact: 'high',
    });
  }

  // Check for recursive calls without memoization
  if (/function\s+(\w+)[^}]*\1\s*\(/.test(code)) {
    issues.push({
      name: 'Recursive Function',
      description: 'Recursive function detected without memoization.',
      severity: 'medium',
    });
    suggestions.push({
      title: 'Memoize recursive calls',
      description: 'Use a cache or convert to dynamic programming for better performance.',
      impact: 'high',
    });
  }

  // Check for DOM operations
  if (/document\.(getElement|querySelector)/.test(code)) {
    issues.push({
      name: 'Direct DOM Access',
      description: 'Direct DOM manipulation can cause layout thrashing.',
      severity: 'low',
    });
    suggestions.push({
      title: 'Batch DOM reads/writes',
      description: 'Group DOM reads and writes to minimize reflows.',
      impact: 'medium',
    });
  }

  // Always add general suggestions
  suggestions.push({
    title: 'Consider memoization hints',
    description: 'Use React.memo or useMemo for expensive computations in component trees.',
    impact: 'medium',
  });

  if (spaceComplexity === 'O(1)') {
    spaceComplexity = 'O(n)';
  }

  return { timeComplexity, spaceComplexity, issues, suggestions };
}

export default function PerformancePage() {
  const [code, setCode] = useState(sampleCode);
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeCode = () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const analysis = analyzePerformance(code);
      setResult(analysis);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Performance Analyzer
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Analyze time/space complexity and find optimization opportunities
          </p>
        </div>
        <Button onClick={analyzeCode} disabled={isAnalyzing} className="bg-cyan-600 hover:bg-cyan-700">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCode2 className="h-4 w-4 text-cyan-600" />
              Code Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={code}
              onChange={(val) => setCode(val || '')}
              language="javascript"
              height="500px"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isAnalyzing ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mb-4" />
                <p className="text-gray-500">Analyzing performance...</p>
              </CardContent>
            </Card>
          ) : !hasAnalyzed ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Gauge className="h-12 w-12 mb-4 text-gray-300" />
                <p>Paste your code and click Analyze to see results</p>
              </CardContent>
            </Card>
          ) : result ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      Time Complexity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cyan-600">
                      {result.timeComplexity}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <HardDrive className="h-4 w-4" />
                      Space Complexity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-violet-600">
                      {result.spaceComplexity}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Detected Issues
                    <Badge variant="secondary">{result.issues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.issues.length === 0 ? (
                    <p className="text-sm text-gray-500">No performance issues detected</p>
                  ) : (
                    <div className="space-y-3">
                      {result.issues.map((issue, index) => (
                        <div
                          key={index}
                          className={`rounded-lg border p-3 ${
                            issue.severity === 'high'
                              ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
                              : issue.severity === 'medium'
                              ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
                              : 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                              {issue.name}
                            </span>
                            <Badge
                              variant={issue.severity === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {issue.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-4 w-4 text-emerald-500" />
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30"
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {suggestion.title}
                          </span>
                          <Badge
                            variant={suggestion.impact === 'high' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
