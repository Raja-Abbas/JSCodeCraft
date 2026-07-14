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
  BookOpen,
  Sparkles,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

const defaultCode = `async function fetchData(urls) {
  const results = [];
  for (const url of urls) {
    const response = await fetch(url);
    const data = await response.json();
    results.push(data);
  }
  return results;
}

function flatten(arr) {
  return arr.reduce((acc, val) => {
    return Array.isArray(val)
      ? acc.concat(flatten(val))
      : acc.concat(val);
  }, []);
}

const memo = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};`;

interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

const mockQuizQuestions: QuizQuestion[] = [
  {
    question:
      "What is the time complexity of the fetchData function when given n URLs?",
    options: [
      "O(1) - constant time",
      "O(n) - linear, but requests run sequentially",
      "O(n log n) - linearithmic due to JSON parsing",
      "O(n²) - quadratic due to array push",
    ],
    correctIndex: 1,
    explanation:
      "fetchData uses a for...of loop with await, meaning each fetch completes before the next one starts. This gives O(n) sequential execution. Each individual fetch is I/O bound, and they don't run in parallel.",
  },
  {
    question:
      "How could you modify fetchData to run all requests in parallel instead of sequentially?",
    options: [
      "Replace for...of with for...in",
      "Use Promise.all() with urls.map(url => fetch(url).then(r => r.json()))",
      "Add 'async' keyword to the fetch call",
      "Use setTimeout to delay each request",
    ],
    correctIndex: 1,
    explanation:
      "Promise.all() takes an array of promises and resolves when all are complete. By mapping each URL to a fetch promise, all requests fire simultaneously, dramatically reducing total wait time from O(n) to O(1) wall time.",
  },
  {
    question:
      "What potential issue exists with the flatten function when given deeply nested arrays?",
    options: [
      "It will return undefined for empty arrays",
      "It could hit the maximum call stack size for extremely deep nesting",
      "It doesn't handle null or undefined values in the array",
      "It creates a new array on each concat, which is always a bug",
    ],
    correctIndex: 1,
    explanation:
      "flatten uses recursion, and each level of nesting adds a frame to the call stack. For extremely deep arrays (thousands of levels), this will cause a RangeError: Maximum call stack size exceeded. An iterative approach with a stack would be safer.",
  },
  {
    question:
      "What problem could occur with the memo function when caching objects as arguments?",
    options: [
      "The cache will never store anything",
      "JSON.stringify is not deterministic for objects with different key order",
      "Map cannot store objects as values",
      "The spread operator ...args doesn't work with memo",
    ],
    correctIndex: 1,
    explanation:
      "JSON.stringify does not guarantee consistent key ordering for objects. {a: 1, b: 2} and {b: 2, a: 1} may produce different strings, causing cache misses for semantically identical arguments. This is a subtle but real bug in memoization.",
  },
  {
    question:
      "What happens to the memo cache over time in a long-running application?",
    options: [
      "It automatically clears when the function is garbage collected",
      "It grows unboundedly, potentially causing a memory leak",
      "It is cleared each time the function is called",
      "The Map automatically evicts old entries like an LRU cache",
    ],
    correctIndex: 1,
    explanation:
      "The Map cache stores every unique argument set forever. In a long-running app with varied inputs, this cache grows without bound, consuming more and more memory. Production memoization libraries implement TTL, LRU eviction, or max-size limits.",
  },
  {
    question:
      "If one fetch in fetchData fails, what happens to the entire function?",
    options: [
      "It skips the failed URL and continues with the rest",
      "The entire function throws and no results are returned",
      "It returns null for the failed URL and continues",
      "It retries the failed URL up to 3 times",
    ],
    correctIndex: 1,
    explanation:
      "An unhandled rejection in the for...of loop will propagate up and reject the entire fetchData promise. None of the previously fetched results are returned. A try/catch inside the loop would be needed for graceful degradation.",
  },
  {
    question:
      "What is the output of flatten([1, [2, [3, [4]]], 5])?",
    options: [
      "[1, 2, 3, 4, 5]",
      "[1, [2, 3, 4], 5]",
      "[1, 2, [3, [4]], 5]",
      "Error: flatten is not defined",
    ],
    correctIndex: 0,
    explanation:
      "flatten recursively unwraps all nested arrays. [1, [2, [3, [4]]], 5] becomes [1, 2, 3, 4, 5] as each nested array is traversed and its primitive values are concatenated to the accumulator.",
  },
  {
    question:
      "Why does the memo function use (...args) instead of (arg) as the parameter?",
    options: [
      "It's just a style preference with no functional difference",
      "To support functions that accept multiple arguments",
      "To prevent the function from being called with no arguments",
      "To make JSON.stringify work correctly",
    ],
    correctIndex: 1,
    explanation:
      "Using rest parameters (...args) allows memo to wrap functions with any number of parameters. A single (arg) parameter would only work for unary functions. The rest params are then serialized as an array via JSON.stringify for the cache key.",
  },
];

export default function QuizPage() {
  const [code, setCode] = useState(defaultCode);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [generated, setGenerated] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  function handleGenerate() {
    setQuestions(mockQuizQuestions);
    setGenerated(true);
    setSelectedAnswers({});
    setShowResults({});
  }

  function handleSelectAnswer(questionIndex: number, optionIndex: number) {
    if (showResults[questionIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }

  function handleShowAnswer(questionIndex: number) {
    setShowResults((prev) => ({ ...prev, [questionIndex]: true }));
  }

  function handleReset() {
    setSelectedAnswers({});
    setShowResults({});
  }

  const answeredCount = Object.keys(showResults).filter(
    (k) => showResults[Number(k)]
  ).length;
  const correctCount = Object.keys(showResults).filter(
    (k) =>
      showResults[Number(k)] &&
      selectedAnswers[Number(k)] ===
        questions[Number(k)]?.correctIndex
  ).length;
  const totalQuestions = questions.length;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  function getOptionStyle(
    qIndex: number,
    oIndex: number
  ): string {
    const q = questions[qIndex];
    if (!q) return "";
    const isSelected = selectedAnswers[qIndex] === oIndex;
    const isCorrect = oIndex === q.correctIndex;
    const revealed = showResults[qIndex];

    if (!revealed) {
      if (isSelected) {
        return "border-cyan-500 bg-cyan-500/10 text-cyan-300";
      }
      return "border-white/10 hover:border-white/20 hover:bg-white/5";
    }

    if (isCorrect) {
      return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
    }
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-500/10 text-red-300";
    }
    return "border-white/5 opacity-50";
  }

  function getOptionIcon(qIndex: number, oIndex: number): React.ReactNode {
    const q = questions[qIndex];
    if (!q || !showResults[qIndex]) return null;
    if (oIndex === q.correctIndex) {
      return <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
    }
    if (
      selectedAnswers[qIndex] === oIndex &&
      oIndex !== q.correctIndex
    ) {
      return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Quiz Generator
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Test your understanding with AI-generated multiple-choice questions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-500" />
                Your Code
              </CardTitle>
              <CardDescription>
                Paste code to generate quiz questions from
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

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Quiz
            </Button>
            {generated && (
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          {generated && totalQuestions > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {answeredCount} of {totalQuestions} answered
                  </span>
                  <span className="font-bold text-lg text-white">
                    {correctCount}/{answeredCount || 0}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
                      backgroundColor:
                        scorePercent >= 70
                          ? "#10b981"
                          : scorePercent >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                </div>
                {answeredCount === totalQuestions && (
                  <div className="text-center pt-2">
                    <p className="text-2xl font-bold text-white">
                      {scorePercent}%
                    </p>
                    <p className="text-sm text-gray-400">
                      {scorePercent >= 80
                        ? "Excellent work!"
                        : scorePercent >= 60
                          ? "Good effort!"
                          : "Keep practicing!"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {generated && questions.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Questions ({questions.length})
              </h2>

              {questions.map((q, qIndex) => (
                <Card key={qIndex} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                        {qIndex + 1}
                      </span>
                      <CardTitle className="text-sm leading-relaxed">
                        {q.question}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() =>
                          handleSelectAnswer(qIndex, oIndex)
                        }
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${getOptionStyle(qIndex, oIndex)}`}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {getOptionIcon(qIndex, oIndex)}
                      </button>
                    ))}

                    <div className="flex gap-2 pt-2">
                      {!showResults[qIndex] && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowAnswer(qIndex)}
                          disabled={selectedAnswers[qIndex] === undefined}
                        >
                          Show Answer
                        </Button>
                      )}
                    </div>

                    {showResults[qIndex] && (
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs font-medium text-cyan-400 mb-1">
                          Explanation
                        </p>
                        <p className="text-sm text-gray-300">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
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
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  Paste your code and click &quot;Generate Quiz&quot; to get
                  started
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
