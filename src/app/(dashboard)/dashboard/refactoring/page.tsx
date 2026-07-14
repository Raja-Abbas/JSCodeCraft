"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Wand2,
  Zap,
  Code2,
  Layers,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

type RefactorMode = "clean" | "performance" | "functional" | "oop" | "modern";

const sampleCode = `// Messy code to refactor
function processData(items) {
  var results = [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].active == true) {
      var item = items[i];
      var name = item.name.toUpperCase();
      var price = item.price * 1.1;
      results.push({
        name: name,
        price: price
      });
    }
  }
  return results;
}`;

const refactoredResults: Record<RefactorMode, { code: string; changes: string[] }> = {
  clean: {
    code: `function processData(items) {
  return items
    .filter((item) => item.active === true)
    .map((item) => ({
      name: item.name.toUpperCase(),
      price: item.price * 1.1,
    }));
}`,
    changes: [
      "Replaced var with const for proper scoping",
      "Used strict equality (===) instead of loose equality (==)",
      "Extracted filtering logic into a dedicated filter step",
      "Removed intermediate variable assignments",
      "Applied method chaining for readability",
    ],
  },
  performance: {
    code: `const processData = (() => {
  const taxMultiplier = 1.1;
  const toUpperCase = Function.prototype.call.bind(String.prototype.toUpperCase);

  return function processData(items) {
    const results = [];
    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i];
      if (item.active) {
        results.push({
          name: toUpperCase(item.name),
          price: item.price * taxMultiplier,
        });
      }
    }
    return results;
  };
})();`,
    changes: [
      "Cached tax multiplier outside the hot loop",
      "Used bound toUpperCase to avoid repeated property lookups",
      "Pre-allocated results array pattern with let index",
      "Used cached length in loop condition",
      "Removed redundant .active === true check (truthy evaluation)",
    ],
  },
  functional: {
    code: `const processData = (items) =>
  pipe(
    filter(({ active }) => active),
    map(({ name, price }) => ({
      name: name.toUpperCase(),
      price: price * 1.1,
    }))
  )(items);

const filter = (predicate) => (arr) => arr.filter(predicate);
const map = (transform) => (arr) => arr.map(transform);
const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);`,
    changes: [
      "Extracted pure utility functions (filter, map, pipe)",
      "Used composition pattern with pipe",
      "Applied destructuring in predicates and transforms",
      "All functions are pure — no side effects",
      "Used const arrow functions for immutability",
    ],
  },
  oop: {
    code: `class DataProcessor {
  #taxRate;

  constructor(taxRate = 0.1) {
    this.#taxRate = taxRate;
  }

  process(items) {
    return items
      .filter((item) => item.active)
      .map((item) => this.#transformItem(item));
  }

  #transformItem({ name, price }) {
    return {
      name: name.toUpperCase(),
      price: price * (1 + this.#taxRate),
    };
  }
}

const processor = new DataProcessor();
processor.process(items);`,
    changes: [
      "Encapsulated logic in a DataProcessor class",
      "Used private class fields (#taxRate, #transformItem)",
      "Extracted transform into a private method for reuse",
      "Made tax rate configurable via constructor",
      "Followed Single Responsibility Principle",
    ],
  },
  modern: {
    code: `const processData = (items: Item[]): ProcessedItem[] =>
  items
    .filter(({ active }) => active)
    .map(({ name, price }) => ({
      name: name.toUpperCase(),
      price: price * 1.1,
    } satisfies ProcessedItem));

interface Item {
  name: string;
  price: number;
  active: boolean;
}

interface ProcessedItem {
  name: string;
  price: number;
}`,
    changes: [
      "Added TypeScript type annotations and interfaces",
      "Used 'satisfies' operator for type-safe object literals",
      "Applied destructuring shorthand in arrow functions",
      "Used modern .filter().map() chain",
      "Added explicit interface definitions for safety",
    ],
  },
};

const modes: { id: RefactorMode; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "clean", label: "Clean", icon: <Sparkles className="h-4 w-4" />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" },
  { id: "performance", label: "Performance", icon: <Zap className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20" },
  { id: "functional", label: "Functional", icon: <Code2 className="h-4 w-4" />, color: "bg-violet-500/10 text-violet-400 border-violet-500/30 hover:bg-violet-500/20" },
  { id: "oop", label: "OOP", icon: <Layers className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20" },
  { id: "modern", label: "Modern ES2025", icon: <Wand2 className="h-4 w-4" />, color: "bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500/20" },
];

export default function RefactoringPage() {
  const [activeMode, setActiveMode] = useState<RefactorMode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefactor = (mode: RefactorMode) => {
    setIsProcessing(true);
    setActiveMode(null);
    setTimeout(() => {
      setActiveMode(mode);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Refactoring</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Transform code using different refactoring strategies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" />
              Original Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-background/50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
              {sampleCode}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Refactored Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-[300px]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
                    <p className="text-sm text-muted-foreground">Refactoring...</p>
                  </div>
                </motion.div>
              ) : activeMode ? (
                <motion.pre
                  key={activeMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-mono bg-background/50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto"
                >
                  {refactoredResults[activeMode].code}
                </motion.pre>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-[300px] text-muted-foreground text-sm"
                >
                  Select a refactoring mode to see results
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <Button
            key={mode.id}
            variant="outline"
            size="sm"
            onClick={() => handleRefactor(mode.id)}
            disabled={isProcessing}
            className={`border ${activeMode === mode.id ? mode.color : ""}`}
          >
            {mode.icon}
            {mode.label}
          </Button>
        ))}
      </div>

      <AnimatePresence>
        {activeMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  What Changed & Why
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {refactoredResults[activeMode].changes.map((change, i) => (
                    <motion.div
                      key={change}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{change}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
