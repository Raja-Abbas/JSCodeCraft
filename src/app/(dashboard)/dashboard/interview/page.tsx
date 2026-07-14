"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CodeEditor from "@/components/code-editor";
import {
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
} from "lucide-react";

const defaultCode = `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const expensiveSearch = debounce((query) => {
  return fetch(\`/api/search?q=\${query}\`)
    .then(res => res.json());
}, 300);

document.getElementById('search').addEventListener('input', (e) => {
  expensiveSearch(e.target.value);
});`;

const difficultyLevels = ["Junior", "Mid", "Senior", "Staff Engineer"] as const;
type Difficulty = (typeof difficultyLevels)[number];

interface InterviewQuestion {
  question: string;
  whyItMatters: string;
  expectedPoints: string[];
  difficulty: Difficulty;
}

const mockQuestionsByDifficulty: Record<Difficulty, InterviewQuestion[]> = {
  Junior: [
    {
      question:
        "What does the debounce function do, and why is it useful in this code?",
      whyItMatters:
        "Understanding debounce is fundamental for handling user input efficiently and preventing unnecessary API calls.",
      expectedPoints: [
        "Debounce delays function execution until after a pause in invocations",
        "Prevents firing an API call on every keystroke",
        "Only the last call within the delay window is actually executed",
        "Useful for search-as-you-type functionality",
      ],
      difficulty: "Junior",
    },
    {
      question:
        "What is a closure and how does it apply to this debounce implementation?",
      whyItMatters:
        "Closures are a core JavaScript concept used extensively in real-world patterns like this.",
      expectedPoints: [
        "The returned function 'closes over' the timer variable",
        "timer persists between calls even though debounce has already returned",
        "Each invocation of debounce creates a new closure with its own timer",
        "Without closures, timer state could not be maintained",
      ],
      difficulty: "Junior",
    },
    {
      question:
        "What does 'this' refer to inside the debounced function, and why is apply() used?",
      whyItMatters:
        "Correct 'this' binding is essential for reusable utility functions.",
      expectedPoints: [
        "apply(this, args) preserves the calling context",
        "Without apply, 'this' would be undefined or window in strict mode",
        "This ensures the original function receives the correct receiver",
        "apply lets us spread an array of arguments as individual parameters",
      ],
      difficulty: "Junior",
    },
    {
      question:
        "What would happen if a user types 10 characters quickly? How many API calls are made?",
      whyItMatters:
        "Demonstrates understanding of how debounce affects runtime behavior.",
      expectedPoints: [
        "Only 1 API call is made after the user stops typing for 300ms",
        "Each keystroke clears the previous timer",
        "Only the final timeout fires and executes the fetch",
        "This prevents 9 unnecessary network requests",
      ],
      difficulty: "Junior",
    },
  ],
  Mid: [
    {
      question:
        "How would you add a cancel method to this debounce so pending calls can be aborted?",
      whyItMatters:
        "Production debounce utilities need cleanup mechanisms to prevent memory leaks and stale calls.",
      expectedPoints: [
        "Expose a cancel property on the returned function",
        "cancel should call clearTimeout(timer)",
        "Could also add a flush method that immediately invokes the pending call",
        "Consider returning an object with both the debounced fn and cancel/flush methods",
      ],
      difficulty: "Mid",
    },
    {
      question:
        "What potential issues exist with the template literal in the fetch URL?",
      whyItMatters:
        "URL construction without encoding can lead to security vulnerabilities and broken requests.",
      expectedPoints: [
        "Query parameter values are not URL-encoded",
        "Special characters in the search query could break the URL",
        "Should use encodeURIComponent on the query value",
        "Potential XSS vector if the URL is rendered somewhere unsafely",
      ],
      difficulty: "Mid",
    },
    {
      question:
        "What happens if the component unmounts while a debounced fetch is still pending?",
      whyItMatters:
        "Resource cleanup on unmount is critical in modern UI frameworks to avoid state-update-on-unmounted warnings.",
      expectedPoints: [
        "The fetch may complete after the component is gone",
        "Response handler could try to update unmounted component state",
        "Need to track an 'isMounted' flag or use AbortController",
        "In React, return a cleanup function from useEffect that calls cancel()",
      ],
      difficulty: "Mid",
    },
    {
      question:
        "How would you test this debounce function? Describe your test strategy.",
      whyItMatters:
        "Testing asynchronous timing behavior is a key skill for writing reliable code.",
      expectedPoints: [
        "Use fake timers (jest.useFakeTimers / vi.useFakeTimers)",
        "Test that the callback is not called before the delay",
        "Test that it is called once after the delay with the last arguments",
        "Test that rapid calls within the delay window only trigger one execution",
        "Test cancel and flush if implemented",
      ],
      difficulty: "Mid",
    },
    {
      question:
        "Could this debounce implementation cause a memory leak? If so, how?",
      whyItMatters:
        "Understanding implicit memory retention through closures helps prevent production issues.",
      expectedPoints: [
        "The timer reference is held by the closure until it fires or is cleared",
        "If the debounced function is never called again and never cancelled, the closure and its references persist",
        "In long-lived applications, accumulated closures from repeated debounce creation can grow memory",
        "Clearing the timer and nullifying references on cancel helps mitigate this",
      ],
      difficulty: "Mid",
    },
  ],
  Senior: [
    {
      question:
        "How would you refactor this to support both debounce and throttle with a shared API?",
      whyItMatters:
        "Designing extensible utility APIs demonstrates architectural thinking and code reuse.",
      expectedPoints: [
        "Create a higher-order rateLimiter utility that accepts a strategy parameter",
        "Debounce delays until quiet period; throttle enforces minimum interval between calls",
        "Share common concerns (timer management, leading/trailing options, cancel/flush)",
        "Consider a builder pattern or options object for configuration",
      ],
      difficulty: "Senior",
    },
    {
      question:
        "This code attaches a raw DOM event listener. How would you migrate this to a React component while preserving the debounce behavior?",
      whyItMatters:
        "Bridging imperative DOM patterns to declarative frameworks is a common real-world task.",
      expectedPoints: [
        "Use useRef to persist the debounced function across renders",
        "Create the debounced function in a useEffect with cleanup",
        "Or use useMemo to stabilize the debounced callback",
        "Return cleanup from useEffect to cancel pending debounce on unmount",
        "Use onChange handler on the input element instead of addEventListener",
      ],
      difficulty: "Senior",
    },
    {
      question:
        "What are the trade-offs between using debounce here versus an AbortController-based approach for cancelling stale requests?",
      whyItMatters:
        "Choosing the right cancellation strategy affects UX, network efficiency, and code complexity.",
      expectedPoints: [
        "Debounce prevents the request from being sent at all",
        "AbortController cancels in-flight requests, saving bandwidth",
        "Best approach: combine both - debounce to reduce calls, AbortController for any that slip through",
        "AbortController also handles server-side processing, not just network",
        "Debounce has no overhead; AbortController adds complexity but handles more edge cases",
      ],
      difficulty: "Senior",
    },
    {
      question:
        "How would you make this debounce work in a Web Worker context where 'this' binding and DOM references don't exist?",
      whyItMatters:
        "Offloading expensive computations to Web Workers is an advanced performance optimization.",
      expectedPoints: [
        "Remove reliance on 'this' binding - use arrow functions or explicit parameters",
        "Replace addEventListener with postMessage for worker communication",
        "The debounce logic itself works in workers since it only uses closures and timers",
        "Need to serialize arguments since worker messages are structured-cloned",
        "Consider SharedArrayBuffer for high-performance scenarios",
      ],
      difficulty: "Senior",
    },
    {
      question:
        "Design a debounce implementation that supports immediate invocation (leading edge) and maxWait options. How does this change the internal state management?",
      whyItMatters:
        "Production-grade debounce libraries like Lodash offer these options, and understanding them shows depth.",
      expectedPoints: [
        "Leading option fires on the leading edge instead of trailing",
        "maxWait ensures the function is called at least once within a time window",
        "Internal state needs: lastCallTime, lastInvokeTime, timerId, and optionally leading flag",
        "maxWait effectively creates a throttle behavior when combined with debounce",
        "Need to track both timeSinceLastCall and timeSinceLastInvoke independently",
      ],
      difficulty: "Senior",
    },
  ],
  "Staff Engineer": [
    {
      question:
        "You're tasked with implementing a distributed debounce for a real-time collaborative editor where changes come from multiple clients. How would you approach this?",
      whyItMatters:
        "Staff engineers must reason about distributed systems constraints and design for consistency across nodes.",
      expectedPoints: [
        "Local debounce on each client reduces immediate network traffic",
        "Need conflict resolution when multiple clients edit simultaneously",
        "Consider operational transformation or CRDT for merge semantics",
        "Server-side debounce or batching can further reduce write amplification",
        "Trade off latency vs consistency: aggressive debounce = higher conflict probability",
      ],
      difficulty: "Staff Engineer",
    },
    {
      question:
        "How would you instrument this debounce to collect metrics on call frequency, execution latency, and dropped calls for observability?",
      whyItMatters:
        "Instrumentation at the utility level provides visibility into application behavior at scale.",
      expectedPoints: [
        "Add optional telemetry hooks: onInvoke, onCancel, onDrop",
        "Track invocation count vs execution count to measure debounce effectiveness",
        "Histogram of delay times to understand user interaction patterns",
        "Emit to an APM system (DataDog, OpenTelemetry) without coupling the utility to any specific backend",
        "Make telemetry opt-in to avoid performance overhead in production",
      ],
      difficulty: "Staff Engineer",
    },
    {
      question:
        "This debounce creates a new closure on every call. In a hot path processing 10,000 events per second, what GC pressure issues arise and how would you mitigate them?",
      whyItMatters:
        "Understanding V8 garbage collection behavior is critical for building high-throughput systems.",
      expectedPoints: [
        "Each closure allocates a new context object on the V8 heap",
        "High allocation rate triggers frequent minor GC pauses",
        "Mitigation: reuse a pre-allocated debounce instance instead of creating new ones",
        "Consider object pooling for the arguments array",
        "Measure with --trace-gc or Chrome DevTools memory profiler",
        "Alternative: use a class-based approach with a mutable state object to reduce allocations",
      ],
      difficulty: "Staff Engineer",
    },
    {
      question:
        "How would you architect a global debounce registry that ensures only one debounced instance exists per unique key, preventing duplicate debounced functions across lazy-loaded modules?",
      whyItMatters:
        "Large applications often accidentally create duplicate debounced functions, wasting memory and causing inconsistent behavior.",
      expectedPoints: [
        "Implement a WeakMap-based registry keyed by the original function reference",
        "Or use a string-keyed Map for named debounce instances",
        "Provide a getDebounced(key, fn, delay) factory that returns existing or creates new",
        "Handle edge cases: what if delay changes for the same key?",
        "Consider module-level singleton pattern with hot-reload support",
        "Ensure registry cleanup on module unload in micro-frontends",
      ],
      difficulty: "Staff Engineer",
    },
    {
      question:
        "If this debounce pattern were to be formalized into a shared internal package used by 50+ teams, what API design, documentation, and migration strategy would you propose?",
      whyItMatters:
        "Staff engineers must think about organizational impact, developer experience, and long-term maintainability.",
      expectedPoints: [
        "API should be backward-compatible with common debounce patterns (lodash, custom)",
        "Provide TypeScript generics for typed return values",
        "Migration guide: codemod for replacing existing debounce implementations",
        "Bundle size analysis and tree-shaking support",
        "Comprehensive JSDoc + runnable examples in the package README",
        "Versioned breaking changes with deprecation warnings",
        "Consider a CLI validator that detects un-migrated debounce usages in CI",
      ],
      difficulty: "Staff Engineer",
    },
  ],
};

export default function InterviewPage() {
  const [code, setCode] = useState(defaultCode);
  const [difficulty, setDifficulty] = useState<Difficulty>("Junior");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [generated, setGenerated] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [showAnswers, setShowAnswers] = useState<Set<number>>(new Set());

  function handleGenerate() {
    setQuestions(mockQuestionsByDifficulty[difficulty]);
    setGenerated(true);
    setExpandedQuestions(new Set([0]));
    setShowAnswers(new Set());
  }

  function toggleQuestion(index: number) {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function toggleAnswer(index: number) {
    setShowAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function getDifficultyColor(d: Difficulty) {
    switch (d) {
      case "Junior":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Mid":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "Senior":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Staff Engineer":
        return "bg-red-500/15 text-red-400 border-red-500/30";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          AI Interview Mode
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Practice JavaScript interview questions based on your code
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-cyan-500" />
                Your Code
              </CardTitle>
              <CardDescription>
                Paste or write the code you want to be interviewed on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={code}
                onChange={setCode}
                height="350px"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Difficulty Level</CardTitle>
              <CardDescription>
                Select the interview difficulty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {difficultyLevels.map((level) => (
                  <Button
                    key={level}
                    variant={difficulty === level ? "default" : "outline"}
                    className={
                      difficulty === level
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                        : ""
                    }
                    onClick={() => setDifficulty(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Interview Questions
          </Button>
        </div>

        <div className="space-y-4">
          {generated && questions.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Questions ({questions.length})
                </h2>
                <Badge className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
              </div>

              {questions.map((q, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full text-left"
                  >
                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <Badge className={getDifficultyColor(q.difficulty)}>
                              {q.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-relaxed">
                            {q.question}
                          </CardTitle>
                        </div>
                        {expandedQuestions.has(index) ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400 mt-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 mt-1" />
                        )}
                      </div>
                    </CardHeader>
                  </button>

                  {expandedQuestions.has(index) && (
                    <CardContent className="space-y-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-400">
                          <Target className="h-3.5 w-3.5" />
                          Why It Matters
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 pl-5">
                          {q.whyItMatters}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                          <Lightbulb className="h-3.5 w-3.5" />
                          Expected Answer Points
                        </div>
                        {showAnswers.has(index) ? (
                          <ul className="space-y-1.5 pl-5">
                            {q.expectedPoints.map((point, pi) => (
                              <li
                                key={pi}
                                className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"
                              >
                                <span className="text-cyan-500 mt-0.5">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400 italic pl-5">
                            Click below to reveal expected answer points
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAnswer(index)}
                        className="ml-5"
                      >
                        {showAnswers.has(index) ? "Hide Answer" : "Show Answer"}
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </>
          )}

          {generated && questions.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                No questions generated. Try pasting different code.
              </CardContent>
            </Card>
          )}

          {!generated && (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Paste your code and click &quot;Generate Interview
                  Questions&quot; to get started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
