'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CodeEditor from '@/components/code-editor';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Play,
  Loader2,
  FileCode2,
} from 'lucide-react';

interface Issue {
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
}

const rules: { id: string; name: string; severity: 'error' | 'warning' | 'info'; regex: RegExp; message: string }[] = [
  { id: 'no-unused-vars', name: 'Unused Variables', severity: 'warning', regex: /(?:var|let|const)\s+(\w+)\s*=[^;]+;(?![\s\S]*?\1(?![\w]))/g, message: 'Variable declared but never used' },
  { id: 'no-console', name: 'Console Log', severity: 'warning', regex: /console\.(log|warn|error|info|debug)\s*\(/g, message: 'Unexpected console statement found' },
  { id: 'no-debugger', name: 'Debugger Statement', severity: 'error', regex: /\bdebugger\b/g, message: 'Debugger statement detected' },
  { id: 'no-eval', name: 'Eval Usage', severity: 'error', regex: /\beval\s*\(/g, message: 'eval() usage detected - security risk' },
  { id: 'no-with', name: 'With Statement', severity: 'error', regex: /\bwith\s*\(/g, message: 'with statement is not allowed in strict mode' },
  { id: 'no-loose-equality', name: 'Loose Equality', severity: 'warning', regex: /[^=!]==[^=]/g, message: 'Use === instead of ==' },
  { id: 'no-document-write', name: 'Document Write', severity: 'error', regex: /document\.write\s*\(/g, message: 'document.write() is deprecated and unsafe' },
  { id: 'no-sync-xhr', name: 'Synchronous XHR', severity: 'error', regex: /\.open\s*\(\s*['"][^'"]*['"][^,]*,\s*[^,]+,\s*false\s*\)/g, message: 'Synchronous XMLHttpRequest on the main thread' },
  { id: 'no-delete-array', name: 'Delete on Array', severity: 'warning', regex: /delete\s+\w+\s*\[\s*\d+\s*\]/g, message: 'Use splice() instead of delete for arrays' },
  { id: 'nested-loops', name: 'Nested Loops (3+ deep)', severity: 'warning', regex: /for\s*\([^)]+\)\s*\{[^}]*for\s*\([^)]+\)\s*\{[^}]*for\s*\([^)]+\)\s*\{/g, message: 'Three or more nested loops detected - high complexity' },
  { id: 'callback-hell', name: 'Callback Hell', severity: 'warning', regex: /\(\s*(?:function\s*\([^)]*\)|[^)]+)\s*=>\s*\{[^}]*\(\s*(?:function\s*\([^)]*\)|[^)]+)\s*=>\s*\{[^}]*\(\s*(?:function\s*\([^)]*\)|[^)]+)\s*=>\s*\{/g, message: 'Three or more nested callbacks - consider refactoring' },
  { id: 'no-alert', name: 'Alert Usage', severity: 'warning', regex: /\balert\s*\(/g, message: 'Unexpected alert() usage' },
  { id: 'no-implied-eval', name: 'Implied Eval', severity: 'warning', regex: /setTimeout\s*\(\s*['"`]/g, message: 'Avoid string-based setTimeout' },
  { id: 'no-proto', name: '__proto__ Usage', severity: 'warning', regex: /\.__proto__\b/g, message: 'Avoid using __proto__ - use Object.getPrototypeOf()' },
  { id: 'no-new-func', name: 'Function Constructor', severity: 'error', regex: /new\s+Function\s*\(/g, message: 'Function constructor is similar to eval()' },
  { id: 'no-unreachable', name: 'Unreachable Code', severity: 'info', regex: /return\s*;[^}]*[a-zA-Z]/g, message: 'Code after return statement may be unreachable' },
  { id: 'prefer-const', name: 'Prefer Const', severity: 'info', regex: /let\s+(\w+)\s*=[^;]+;(?![\s\S]*?\1\s*=[^=])/g, message: 'Variable never reassigned - use const instead' },
  { id: 'no-shadow', name: 'Variable Shadowing', severity: 'info', regex: /function[^{]*\{[\s\S]*(?:var|let|const)\s+(\w+)\s*=[\s\S]*function[^{]*\1\b/g, message: 'Variable shadowing detected' },
  { id: 'no-empty-blocks', name: 'Empty Blocks', severity: 'warning', regex: /\{\s*\}/g, message: 'Empty block detected' },
  { id: 'no-trailing-spaces', name: 'Trailing Whitespace', severity: 'info', regex: /[ \t]+$/gm, message: 'Trailing whitespace detected' },
];

const sampleCode = `// Paste your JavaScript code here for analysis
// Or try the sample code below:

function processData(items) {
  var unused = "hello";
  let result = [];
  
  for (var i = 0; i < items.length; i++) {
    for (var j = 0; j < items[i].length; j++) {
      for (var k = 0; k < items[i][j].length; k++) {
        console.log(items[i][j][k]);
        result.push(items[i][j][k]);
      }
    }
  }
  
  if (items == null) {
    debugger;
  }
  
  with (document) {
    write("Hello");
  }
  
  eval("var x = 10");
  
  setTimeout("alert('hi')", 1000);
  
  document.write("test");
  
  let b = 42;
  
  return result;
  
  unreachableCode();
}`;

function getSeverityIcon(severity: 'error' | 'warning' | 'info') {
  switch (severity) {
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function getSeverityColor(severity: 'error' | 'warning' | 'info') {
  switch (severity) {
    case 'error':
      return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30';
    case 'warning':
      return 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30';
    case 'info':
      return 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30';
  }
}

export default function StaticAnalysisPage() {
  const [code, setCode] = useState(sampleCode);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeCode = () => {
    setIsAnalyzing(true);
    setIssues([]);

    setTimeout(() => {
      const detectedIssues: Issue[] = [];

      rules.forEach((rule) => {
        const matches = code.matchAll(new RegExp(rule.regex.source, rule.regex.flags));
        let matchCount = 0;

        for (const _match of matches) {
          if (matchCount < 3) {
            detectedIssues.push({
              rule: rule.name,
              message: rule.message,
              severity: rule.severity,
              line: matchCount + 1,
            });
          }
          matchCount++;
        }
      });

      setIssues(detectedIssues);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 800);
  };

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Static Analyzer
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Detect code smells, anti-patterns, and potential bugs
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-cyan-600" />
                Analysis Results
              </span>
              {hasAnalyzed && (
                <div className="flex gap-2">
                  {errorCount > 0 && <Badge variant="destructive">{errorCount} Errors</Badge>}
                  {warningCount > 0 && <Badge className="bg-amber-500">{warningCount} Warnings</Badge>}
                  {infoCount > 0 && <Badge className="bg-blue-500">{infoCount} Info</Badge>}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600 mb-4" />
                <p>Analyzing your code...</p>
              </div>
            ) : !hasAnalyzed ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <FileCode2 className="h-12 w-12 mb-4 text-gray-300" />
                <p>Paste your code and click Analyze to see results</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-emerald-600">
                <CheckCircle className="h-12 w-12 mb-4" />
                <p className="font-medium">No issues found!</p>
                <p className="text-sm text-gray-500">Your code looks clean</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {issue.rule}
                          </span>
                          {issue.line && (
                            <span className="text-xs text-gray-500">Line {issue.line}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
