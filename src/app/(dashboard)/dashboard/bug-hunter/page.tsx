"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  Lightbulb,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface BugInfo {
  lineNumber: number;
  description: string;
  hint: string;
  type: string;
}

interface CodeSnippet {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  code: string;
  bugs: BugInfo[];
}

const codeSnippets: CodeSnippet[] = [
  {
    title: "Array Processing Pipeline",
    difficulty: "Easy",
    code: `function processUsers(users) {
  const active = [];
  for (let i = 0; i <= users.length; i++) {
    if (users[i].active === true) {
      const fullName = users[i].firstName + users[i].lastName;
      active.push({
        name: fullName,
        email: users[i].email.toLowerCase(),
      });
    }
  }
  return active;
}

function formatPrice(price, tax) {
  const total = price + tax;
  return "$" + total.toFixed(2);
}

const items = [{ price: "19.99", tax: "1.50" }];
items.forEach(item => {
  console.log(formatPrice(item.price, item.tax));
});`,
    bugs: [
      {
        lineNumber: 3,
        description:
          "Off-by-one error: i <= users.length will access users[users.length] which is undefined, causing a runtime error.",
        hint: "Think about the valid index range for arrays.",
        type: "Off-by-one",
      },
      {
        lineNumber: 23,
        description:
          "Type coercion bug: price and tax are strings, so '+' performs string concatenation instead of addition. '19.99' + '1.50' = '19.991.50'.",
        hint: "What does the + operator do with strings vs numbers?",
        type: "Type Coercion",
      },
      {
        lineNumber: 6,
        description:
          "Potential null reference: if any user object lacks a 'firstName' or 'lastName' property, concatenation produces 'undefinedundefined'.",
        hint: "Not all users may have all properties filled in.",
        type: "Null Reference",
      },
    ],
  },
  {
    title: "Async Data Fetcher",
    difficulty: "Medium",
    code: `class DataFetcher {
  constructor() {
    this.cache = {};
    this.loading = false;
  }

  async fetchData(url) {
    if (this.cache[url]) {
      return this.cache[url];
    }

    this.loading = true;
    const response = await fetch(url);
    const data = await response.json();
    this.cache[url] = data;
    this.loading = false;
    return data;
  }

  async fetchMultiple(urls) {
    const results = [];
    urls.forEach(async (url) => {
      const data = await this.fetchData(url);
      results.push(data);
    });
    return results;
  }

  getCacheSize() {
    return Object.keys(this.cache).length;
  }

  clearOldEntries(maxAge) {
    const now = Date.now();
    for (const key in this.cache) {
      if (now - this.cache[key].timestamp > maxAge) {
        delete this.cache[key];
      }
    }
  }
}`,
    bugs: [
      {
        lineNumber: 24,
        description:
          "Race condition: forEach with async callback doesn't await. fetchMultiple returns an empty results array before any fetch completes because push happens asynchronously.",
        hint: "forEach doesn't wait for async callbacks to resolve.",
        type: "Async Race Condition",
      },
      {
        lineNumber: 15,
        description:
          "Race condition: if fetchData is called twice with the same URL concurrently before the first completes, both calls bypass the cache check and fire duplicate requests.",
        hint: "What happens if two calls check the cache before either sets it?",
        type: "Async Race Condition",
      },
      {
        lineNumber: 16,
        description:
          "Missing error handling: if fetch throws (network error, invalid JSON), this.loading is never set back to false, leaving the class permanently in a loading state.",
        hint: "What happens to the loading flag if the request fails?",
        type: "Memory Leak / State Corruption",
      },
    ],
  },
  {
    title: "Event-Driven State Machine",
    difficulty: "Hard",
    code: `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      cb => cb !== callback
    );
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(...args));
  }
}

class StateMachine {
  constructor(initialState, transitions) {
    this.state = initialState;
    this.transitions = transitions;
    this.emitter = new EventEmitter();
    this.history = [];
  }

  transition(action) {
    const valid = this.transitions[this.state];
    if (!valid || !valid[action]) {
      throw new Error(\`Invalid transition: \${action} from \${this.state}\`);
    }
    this.history.push(this.state);
    this.state = valid[action];
    this.emitter.emit("change", this.state);
    return this.state;
  }

  canTransition(action) {
    const valid = this.transitions[this.state];
    return valid && valid[action];
  }

  undo() {
    if (this.history.length === 0) return this.state;
    const prev = this.history.pop();
    this.state = prev;
    this.emitter.emit("change", this.state);
    return this.state;
  }
}

class Timer {
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
    this.id = null;
    this.startTime = null;
    this.remaining = delay;
  }

  start() {
    this.startTime = Date.now();
    this.id = setTimeout(() => {
      this.callback();
      this.id = null;
    }, this.remaining);
  }

  pause() {
    if (this.id) {
      clearTimeout(this.id);
      this.id = null;
      this.remaining -= (Date.now() - this.startTime);
    }
  }

  resume() {
    if (this.id === null && this.remaining > 0) {
      this.start();
    }
  }
}`,
    bugs: [
      {
        lineNumber: 54,
        description:
          "State history corruption: if undo() is called, the emitter still emits a 'change' event, but a subsequent transition() pushes the restored state again, potentially allowing duplicate history entries and incorrect undo chains.",
        hint: "Think about what happens when you undo then transition again.",
        type: "Logic Error",
      },
      {
        lineNumber: 78,
        description:
          "Memory leak: Timer holds a reference to callback via closure. If timer is never paused or cleared, the callback and everything it closes over remains in memory. The Timer class has no destroy/cleanup method.",
        hint: "What happens to the callback reference when the timer is done?",
        type: "Memory Leak",
      },
      {
        lineNumber: 84,
        description:
          "Race condition in pause(): if pause() is called while the callback is executing (setTimeout fired but callback still running), clearTimeout has no effect but remaining time calculation is still performed, corrupting the remaining time.",
        hint: "Consider what happens if pause is called at exactly the timeout boundary.",
        type: "Race Condition",
      },
      {
        lineNumber: 92,
        description:
          "Bug in resume(): resume checks this.id === null but doesn't verify the timer hasn't naturally expired. If the callback already ran (id was set to null in the timeout callback), resume() would restart the timer and call the callback a second time.",
        hint: "After a setTimeout fires, what is the state of the id property?",
        type: "Logic Error",
      },
    ],
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function BugHunterPage() {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "results"
  >("idle");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [snippetResults, setSnippetResults] = useState<
    Array<{
      found: number;
      total: number;
      hintsUsed: number;
      time: number;
    }>
  >([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const snippet = codeSnippets[currentSnippet];
  const filteredSnippets = codeSnippets.filter(
    (s) => s.difficulty === difficulty
  );
  const activeSnippet =
    filteredSnippets[currentSnippet] || filteredSnippets[0] || codeSnippets[0];

  const startTimer = useCallback(() => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleStartGame() {
    setGameState("playing");
    setCurrentSnippet(0);
    setSelectedLines(new Set());
    setRevealed(false);
    setHintsUsed(0);
    setShowHint(false);
    setTotalScore(0);
    setSnippetResults([]);
    startTimer();
  }

  function handleLineClick(lineNumber: number) {
    if (gameState !== "playing" || revealed) return;
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineNumber)) {
        next.delete(lineNumber);
      } else {
        next.add(lineNumber);
      }
      return next;
    });
  }

  function handleSubmit() {
    stopTimer();
    const bugs = activeSnippet.bugs;
    const bugLineNumbers = new Set(bugs.map((b) => b.lineNumber));
    let found = 0;
    selectedLines.forEach((line) => {
      if (bugLineNumbers.has(line)) found++;
    });

    const score = Math.max(
      0,
      Math.round(
        (found / bugs.length) * 100 - hintsUsed * 10
      )
    );

    setTotalScore((prev) => prev + score);
    setSnippetResults((prev) => [
      ...prev,
      { found, total: bugs.length, hintsUsed, time: timer },
    ]);
    setRevealed(true);
    setGameState("results");
  }

  function handleNextSnippet() {
    if (currentSnippet + 1 >= filteredSnippets.length) {
      setGameState("idle");
      stopTimer();
      return;
    }
    setCurrentSnippet((prev) => prev + 1);
    setSelectedLines(new Set());
    setRevealed(false);
    setHintsUsed(0);
    setShowHint(false);
    setGameState("playing");
    setTimer(0);
    startTimer();
  }

  function handleUseHint() {
    if (hintsUsed >= activeSnippet.bugs.length) return;
    setHintsUsed((prev) => prev + 1);
    setShowHint(true);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function getLineStatus(lineNumber: number): "bug" | "selected" | "missed" | "wrong" | "normal" {
    if (!revealed) {
      return selectedLines.has(lineNumber) ? "selected" : "normal";
    }
    const bugLines = new Set(activeSnippet.bugs.map((b) => b.lineNumber));
    const isBug = bugLines.has(lineNumber);
    const isSelected = selectedLines.has(lineNumber);
    if (isBug && isSelected) return "bug";
    if (isBug && !isSelected) return "missed";
    if (!isBug && isSelected) return "wrong";
    return "normal";
  }

  function getLineClassName(status: string): string {
    switch (status) {
      case "bug":
        return "bg-emerald-500/10 border-l-2 border-emerald-500";
      case "selected":
        return "bg-cyan-500/10 border-l-2 border-cyan-500";
      case "missed":
        return "bg-red-500/10 border-l-2 border-red-500";
      case "wrong":
        return "bg-red-500/5 border-l-2 border-red-400";
      default:
        return "border-l-2 border-transparent hover:bg-white/5";
    }
  }

  const lines = activeSnippet.code.split("\n");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Bug Hunter
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Find hidden bugs in code snippets. Click on buggy lines to identify
          them.
        </p>
      </div>

      {gameState === "idle" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Difficulty</CardTitle>
              <CardDescription>
                Harder difficulties have more subtle bugs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {(["Easy", "Medium", "Hard"] as const).map((d) => (
                  <Button
                    key={d}
                    variant={difficulty === d ? "default" : "outline"}
                    className={
                      difficulty === d
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                        : ""
                    }
                    onClick={() => {
                      setDifficulty(d);
                      setCurrentSnippet(0);
                    }}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-400">
              <p>
                1. Each code snippet contains{" "}
                <span className="text-white font-medium">
                  {activeSnippet.bugs.length} hidden bugs
                </span>
              </p>
              <p>
                2. Click on the lines you think contain bugs
              </p>
              <p>
                3. Use hints if you get stuck (costs points)
              </p>
              <p>
                4. Submit your answers to see the results
              </p>
              <p>
                5. Faster completion and fewer hints = higher score
              </p>
            </CardContent>
          </Card>

          <Button
            onClick={handleStartGame}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Game
          </Button>

          {totalScore > 0 && snippetResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Previous Score: {totalScore}
                </CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      )}

      {(gameState === "playing" || gameState === "results") && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white">
                  {activeSnippet.title}
                </h2>
                <Badge className={difficultyColors[activeSnippet.difficulty]}>
                  {activeSnippet.difficulty}
                </Badge>
                <Badge variant="secondary">
                  {currentSnippet + 1}/{filteredSnippets.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Timer className="h-4 w-4" />
                {formatTime(timer)}
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="font-mono text-sm">
                  {lines.map((line, idx) => {
                    const lineNumber = idx + 1;
                    const status = getLineStatus(lineNumber);
                    const isClickable =
                      gameState === "playing" && !revealed;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center px-4 py-0.5 cursor-pointer transition-colors ${getLineClassName(status)} ${isClickable ? "hover:bg-cyan-500/5" : ""}`}
                        onClick={() => handleLineClick(lineNumber)}
                      >
                        <span className="w-8 text-right text-gray-500 select-none mr-4 shrink-0 text-xs">
                          {lineNumber}
                        </span>
                        <span className="flex-1 whitespace-pre text-gray-300">
                          {line || " "}
                        </span>
                        {status === "bug" && (
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {status === "missed" && (
                          <XCircle className="h-4 w-4 text-red-400 shrink-0 ml-2" />
                        )}
                        {status === "wrong" && (
                          <XCircle className="h-4 w-4 text-red-400 shrink-0 ml-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {gameState === "playing" && (
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                  size="lg"
                  disabled={selectedLines.size === 0}
                >
                  Submit ({selectedLines.size} line
                  {selectedLines.size !== 1 ? "s" : ""} selected)
                </Button>
                <Button
                  onClick={handleUseHint}
                  variant="outline"
                  size="lg"
                  disabled={hintsUsed >= activeSnippet.bugs.length}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Hint ({hintsUsed}/{activeSnippet.bugs.length})
                </Button>
              </div>
            )}

            {revealed && (
              <Button
                onClick={handleNextSnippet}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                size="lg"
              >
                {currentSnippet + 1 >= filteredSnippets.length
                  ? "See Final Results"
                  : "Next Snippet"}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {showHint && gameState === "playing" && (
              <Card className="border-amber-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-400 text-sm">
                    <Lightbulb className="h-4 w-4" />
                    Hint {hintsUsed}/{activeSnippet.bugs.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    {activeSnippet.bugs[Math.min(hintsUsed - 1, activeSnippet.bugs.length - 1)]?.hint}
                  </p>
                </CardContent>
              </Card>
            )}

            {revealed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    Bug Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeSnippet.bugs.map((bug, idx) => {
                    const wasFound = selectedLines.has(bug.lineNumber);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-sm ${
                          wasFound
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-red-500/30 bg-red-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {wasFound ? (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                          )}
                          <span className="font-medium text-white">
                            Line {bug.lineNumber}
                          </span>
                          <Badge variant="secondary" className="text-[10px]">
                            {bug.type}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-xs">
                          {bug.description}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500" />
                  <span className="text-gray-400">Your selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
                  <span className="text-gray-400">Correctly found bug</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500" />
                  <span className="text-gray-400">Missed bug</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/10 border border-red-400" />
                  <span className="text-gray-400">Wrong selection</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {gameState === "idle" && snippetResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-sm text-gray-400">Total Score</span>
                <span className="text-xl font-bold text-white">
                  {totalScore}
                </span>
              </div>
              {snippetResults.map((result, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      Snippet {idx + 1}
                    </p>
                    <p className="text-xs text-gray-400">
                      Found {result.found}/{result.total} bugs
                      {result.hintsUsed > 0 &&
                        ` · ${result.hintsUsed} hints used`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        result.found === result.total
                          ? "default"
                          : "secondary"
                      }
                    >
                      {result.found === result.total
                        ? "Perfect"
                        : result.found > 0
                          ? "Partial"
                          : "Missed"}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {formatTime(result.time)}
                    </span>
                  </div>
                </div>
              ))}
              <Button
                onClick={handleStartGame}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
