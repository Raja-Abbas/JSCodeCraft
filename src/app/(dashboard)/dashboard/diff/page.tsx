"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  GitCompareArrows,
  Check,
  X,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified";
  oldLineNum?: number;
  newLineNum?: number;
  content: string;
}

const sampleDiffPairs: Record<string, { original: string; optimized: string }> = {
  "Loop Optimization": {
    original: `// Slow: nested loop to find duplicates
function findDuplicates(arr) {
  var duplicates = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}`,
    optimized: `// Fast: Set-based O(n) approach
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }

  return [...duplicates];
}`,
  },
  "Variable Cleanup": {
    original: `// Messy: var, ==, unnecessary temp vars
var name = user.name;
var age = user.age;
var isActive = user.active == true;
var greeting = "Hello, " + name;
var info = name + " is " + age + " years old";
if (isActive == true) {
  console.log(greeting);
  console.log(info);
}`,
    optimized: `// Clean: const, ===, template literals, destructuring
const { name, age, active: isActive } = user;
const greeting = \`Hello, \${name}\`;
const info = \`\${name} is \${age} years old\`;

if (isActive) {
  console.log(greeting);
  console.log(info);
}`,
  },
  "Async Pattern": {
    original: `// Callback hell
function getUserData(userId, callback) {
  getUser(userId, function(err, user) {
    if (err) return callback(err);
    getPosts(user.id, function(err, posts) {
      if (err) return callback(err);
      getComments(posts[0].id, function(err, comments) {
        if (err) return callback(err);
        callback(null, { user, posts, comments });
      });
    });
  });
}`,
    optimized: `// Clean async/await with error handling
async function getUserData(userId) {
  try {
    const user = await getUser(userId);
    const posts = await getPosts(user.id);
    const comments = posts.length > 0
      ? await getComments(posts[0].id)
      : [];

    return { user, posts, comments };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}`,
  },
};

function computeDiff(original: string, optimized: string): DiffLine[] {
  const oldLines = original.split("\n");
  const newLines = optimized.split("\n");
  const result: DiffLine[] = [];

  const oldSet = new Set(oldLines.map((l) => l.trim()));
  const newSet = new Set(newLines.map((l) => l.trim()));

  let oldIdx = 0;
  let newIdx = 0;

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    const oldLine = oldLines[oldIdx];
    const newLine = newLines[newIdx];

    if (oldIdx >= oldLines.length) {
      result.push({
        type: "added",
        newLineNum: newIdx + 1,
        content: newLine,
      });
      newIdx++;
    } else if (newIdx >= newLines.length) {
      result.push({
        type: "removed",
        oldLineNum: oldIdx + 1,
        content: oldLine,
      });
      oldIdx++;
    } else if (oldLine.trim() === newLine.trim()) {
      result.push({
        type: "unchanged",
        oldLineNum: oldIdx + 1,
        newLineNum: newIdx + 1,
        content: oldLine,
      });
      oldIdx++;
      newIdx++;
    } else if (!newSet.has(oldLine.trim()) && oldLine.trim() !== "") {
      result.push({
        type: "removed",
        oldLineNum: oldIdx + 1,
        content: oldLine,
      });
      oldIdx++;
    } else if (!oldSet.has(newLine.trim()) && newLine.trim() !== "") {
      result.push({
        type: "added",
        newLineNum: newIdx + 1,
        content: newLine,
      });
      newIdx++;
    } else {
      result.push({
        type: "removed",
        oldLineNum: oldIdx + 1,
        content: oldLine,
      });
      result.push({
        type: "added",
        newLineNum: newIdx + 1,
        content: newLine,
      });
      oldIdx++;
      newIdx++;
    }
  }

  return result;
}

export default function DiffPage() {
  const [selectedPair, setSelectedPair] = useState("Loop Optimization");

  const pair = sampleDiffPairs[selectedPair];
  const diff = useMemo(() => computeDiff(pair.original, pair.optimized), [pair]);

  const added = diff.filter((l) => l.type === "added").length;
  const removed = diff.filter((l) => l.type === "removed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Diff Viewer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare original code against optimized versions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="appearance-none bg-background border rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {Object.keys(sampleDiffPairs).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Plus className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400 font-medium">{added} added</span>
        </div>
        <div className="flex items-center gap-1.5">
          <X className="h-3 w-3 text-red-400" />
          <span className="text-red-400 font-medium">{removed} removed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <X className="h-4 w-4 text-red-400" />
              Original
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-background/50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
              {pair.original}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-background/50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
              {pair.optimized}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <GitCompareArrows className="h-4 w-4 text-cyan-400" />
            Unified Diff
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden text-xs font-mono">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`flex border-b border-border/30 last:border-b-0 ${
                  line.type === "added"
                    ? "bg-emerald-500/10"
                    : line.type === "removed"
                    ? "bg-red-500/10"
                    : ""
                }`}
              >
                <div className="w-16 shrink-0 text-right pr-2 py-1 text-muted-foreground/40 select-none border-r border-border/30">
                  {line.oldLineNum ?? ""}
                </div>
                <div className="w-16 shrink-0 text-right pr-2 py-1 text-muted-foreground/40 select-none border-r border-border/30">
                  {line.newLineNum ?? ""}
                </div>
                <div
                  className={`w-8 shrink-0 text-center py-1 font-bold select-none ${
                    line.type === "added"
                      ? "text-emerald-400"
                      : line.type === "removed"
                      ? "text-red-400"
                      : "text-muted-foreground/30"
                  }`}
                >
                  {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                </div>
                <pre
                  className={`flex-1 px-3 py-1 whitespace-pre-wrap ${
                    line.type === "added"
                      ? "text-emerald-300"
                      : line.type === "removed"
                      ? "text-red-300"
                      : "text-muted-foreground"
                  }`}
                >
                  {line.content}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
