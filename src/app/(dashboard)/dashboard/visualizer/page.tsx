"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Link2,
  GitBranch,
  ChevronDown,
} from "lucide-react";

type VisualizerTab = "event-loop" | "execution-context" | "closures" | "promises";

const codeSamples: Record<string, string> = {
  "Event Loop": `console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");`,
  "Execution Context": `const greeting = "hello";

function greet(name) {
  const message = greeting + " " + name;
  return message;
}

greet("world");`,
  Closures: `function outer() {
  const count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
counter();
counter();`,
  Promises: `const fetchUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: "Alice" });
    }, 2000);
  });
};

fetchUser()
  .then(user => console.log(user))
  .catch(err => console.error(err));`,
};

const tabs: { id: VisualizerTab; label: string; icon: React.ReactNode }[] = [
  { id: "event-loop", label: "Event Loop", icon: <GitBranch className="h-4 w-4" /> },
  { id: "execution-context", label: "Execution Context", icon: <Layers className="h-4 w-4" /> },
  { id: "closures", label: "Closures", icon: <Link2 className="h-4 w-4" /> },
  { id: "promises", label: "Promises", icon: <Zap className="h-4 w-4" /> },
];

function EventLoopVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [step, setStep] = useState(0);

  const steps = [
    { callStack: [], webApis: [], microtaskQueue: [], callbackQueue: [], label: "Initial state — code starts executing" },
    { callStack: ["console.log('1')"], webApis: [], microtaskQueue: [], callbackQueue: [], label: "Synchronous: console.log('1') pushed to call stack" },
    { callStack: ["setTimeout(cb, 0)"], webApis: ["setTimeout Timer"], microtaskQueue: [], callbackQueue: [], label: "setTimeout hands off timer to Web APIs" },
    { callStack: ["Promise.then(cb)"], webApis: [], microtaskQueue: ["Promise Callback"], callbackQueue: ["setTimeout Callback"], label: "Promise resolved → callback goes to Microtask Queue; setTimeout → Callback Queue" },
    { callStack: ["console.log('4')"], webApis: [], microtaskQueue: ["Promise Callback"], callbackQueue: ["setTimeout Callback"], label: "Synchronous: console.log('4') pushed to call stack" },
    { callStack: [], webApis: [], microtaskQueue: [], callbackQueue: ["setTimeout Callback"], label: "Microtask queue processed first → '3' logged" },
    { callStack: ["setTimeout Callback"], webApis: [], microtaskQueue: [], callbackQueue: [], label: "Callback queue processed → '2' logged" },
    { callStack: [], webApis: [], microtaskQueue: [], callbackQueue: [], label: "Event loop complete ✓" },
  ];

  const current = steps[step];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          onClick={() => {
            if (step >= steps.length - 1) setStep(0);
            else setStep((s) => s + 1);
          }}
        >
          <Play className="h-4 w-4 mr-1" /> Next Step
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStep(0)}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {step + 1} / {steps.length}
        </span>
      </div>

      <p className="text-sm font-medium text-cyan-400">{current.label}</p>

      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Call Stack", items: current.callStack, color: "border-red-500/40 bg-red-500/5" },
          { title: "Web APIs", items: current.webApis, color: "border-amber-500/40 bg-amber-500/5" },
          { title: "Microtask Queue", items: current.microtaskQueue, color: "border-violet-500/40 bg-violet-500/5" },
          { title: "Callback Queue", items: current.callbackQueue, color: "border-emerald-500/40 bg-emerald-500/5" },
        ].map((box) => (
          <div key={box.title}>
            <div className={`border rounded-lg p-3 min-h-[160px] ${box.color}`}>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">{box.title}</p>
              <AnimatePresence>
                {box.items.map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-xs font-mono bg-background/80 border rounded px-2 py-1 mb-1"
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
              {box.items.length === 0 && (
                <p className="text-xs text-muted-foreground/50 italic">Empty</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <motion.div
            animate={isPlaying ? { x: [0, 60, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-cyan-400"
          />
          <span>→ Web APIs handle async</span>
        </div>
        <span>|</span>
        <div className="flex items-center gap-1">
          <span className="text-violet-400">Microtasks</span>
          <span>have priority over</span>
          <span className="text-emerald-400">Callbacks</span>
        </div>
      </div>
    </div>
  );
}

function ExecutionContextVisualizer() {
  const contexts = [
    {
      id: "global",
      label: "Global Execution Context",
      variables: ["greeting = 'hello'", "greet = <function>"],
      color: "border-cyan-500/50 bg-cyan-500/5",
      depth: 0,
    },
    {
      id: "greet",
      label: "greet('world') Execution Context",
      variables: ["name = 'world'", "message = 'hello world'"],
      color: "border-violet-500/50 bg-violet-500/5",
      depth: 1,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          JavaScript creates an <strong>Execution Context</strong> for every function call. They stack on top of each other.
        </p>
      </div>

      <div className="space-y-3">
        {contexts.map((ctx, i) => (
          <motion.div
            key={ctx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            style={{ marginLeft: ctx.depth * 32 }}
            className={`border rounded-lg p-4 ${ctx.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={ctx.depth === 0 ? "default" : "secondary"}>{ctx.depth === 0 ? "Global" : "Local"}</Badge>
              <span className="text-sm font-semibold">{ctx.label}</span>
            </div>
            <div className="space-y-1">
              {ctx.variables.map((v) => (
                <div key={v} className="text-xs font-mono bg-background/60 border rounded px-2 py-1">
                  {v}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="border-cyan-500/20">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">
            <strong className="text-cyan-400">Call Stack:</strong> When <code>greet(&quot;world&quot;)</code> is called, a new local context is pushed onto the call stack. When it returns, the context is popped off and execution resumes in the global context.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ClosuresVisualizer() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        A <strong>closure</strong> is when an inner function remembers variables from its outer function even after the outer function has returned.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-cyan-500/30 rounded-lg p-4 bg-cyan-500/5"
        >
          <Badge className="mb-2">Outer Scope</Badge>
          <div className="text-xs font-mono space-y-1">
            <p className="text-muted-foreground">function outer() {"{"}</p>
            <p className="pl-4">const count = 0;</p>
            <div className="border-l-2 border-cyan-400/50 pl-3 mt-1">
              <Badge variant="secondary" className="text-[10px] mb-1">Inner Scope (closed over)</Badge>
              <p className="text-muted-foreground">return function inner() {"{"}</p>
              <p className="pl-4 text-cyan-400">count++; {"← remembers outer&apos;s count"}</p>
              <p className="text-muted-foreground">{"}"}</p>
            </div>
            <p className="text-muted-foreground">{"}"}</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground mb-3">Click the button — the inner function closes over <code>count</code>:</p>
              <Button onClick={() => setClickCount((c) => c + 1)} className="w-full">
                counter() → {clickCount}
              </Button>
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-500/50 border border-cyan-400" />
                  <span className="text-xs font-mono">count = {clickCount}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Each call increments <code>count</code> in the closed-over scope. The variable persists because the inner function holds a reference to the outer scope.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PromisesVisualizer() {
  const [status, setStatus] = useState<"idle" | "pending" | "resolved" | "rejected">("idle");

  const runPromise = () => {
    setStatus("pending");
    setTimeout(() => {
      setStatus("resolved");
    }, 2000);
  };

  const rejectPromise = () => {
    setStatus("pending");
    setTimeout(() => {
      setStatus("rejected");
    }, 1500);
  };

  const stateColors = {
    idle: "border-muted bg-muted/20",
    pending: "border-amber-500/50 bg-amber-500/10",
    resolved: "border-emerald-500/50 bg-emerald-500/10",
    rejected: "border-red-500/50 bg-red-500/10",
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button onClick={runPromise} disabled={status === "pending"}>
          <Play className="h-4 w-4 mr-1" /> Resolve
        </Button>
        <Button onClick={rejectPromise} disabled={status === "pending"} variant="destructive">
          <RotateCcw className="h-4 w-4 mr-1" /> Reject
        </Button>
        <Button onClick={() => setStatus("idle")} variant="outline">
          Reset
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        {(["idle", "pending", "resolved", "rejected"] as const).map((state, i) => (
          <div key={state} className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: status === state ? 1.1 : 1,
                opacity: status === state ? 1 : 0.4,
              }}
              className={`w-32 h-20 border-2 rounded-lg flex items-center justify-center text-xs font-semibold uppercase tracking-wider ${stateColors[state]}`}
            >
              {state}
            </motion.div>
            {i < 3 && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground"
              >
                →
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {status === "resolved" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-emerald-500/30 rounded-lg p-4 bg-emerald-500/5"
          >
            <p className="text-sm font-semibold text-emerald-400 mb-1">✓ .then() callback executes</p>
            <p className="text-xs font-mono text-muted-foreground">→ Logs: {'{ name: "Alice" }'}</p>
          </motion.div>
        )}
        {status === "rejected" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-red-500/30 rounded-lg p-4 bg-red-500/5"
          >
            <p className="text-sm font-semibold text-red-400 mb-1">✗ .catch() callback executes</p>
            <p className="text-xs font-mono text-muted-foreground">→ Handles the error gracefully</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-muted">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">
            A <strong className="text-cyan-400">Promise</strong> is an object representing the eventual completion or failure of an async operation. It starts <em>pending</em>, then transitions to either <em>resolved</em> (fulfilled) or <em>rejected</em>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VisualizerPage() {
  const [activeTab, setActiveTab] = useState<VisualizerTab>("event-loop");
  const [selectedSample, setSelectedSample] = useState("Event Loop");
  const [isPlaying, setIsPlaying] = useState(true);

  const renderVisualizer = () => {
    switch (activeTab) {
      case "event-loop":
        return <EventLoopVisualizer isPlaying={isPlaying} />;
      case "execution-context":
        return <ExecutionContextVisualizer />;
      case "closures":
        return <ClosuresVisualizer />;
      case "promises":
        return <PromisesVisualizer />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">JavaScript Visualizer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive visualizations of core JavaScript concepts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="relative">
            <select
              value={selectedSample}
              onChange={(e) => {
                setSelectedSample(e.target.value);
                const key = e.target.value as keyof typeof codeSamples;
                if (key === "Event Loop") setActiveTab("event-loop");
                else if (key === "Execution Context") setActiveTab("execution-context");
                else if (key === "Closures") setActiveTab("closures");
                else if (key === "Promises") setActiveTab("promises");
              }}
              className="appearance-none bg-background border rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {Object.keys(codeSamples).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sample Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-background/50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {codeSamples[selectedSample]}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Visualization</CardTitle>
          </CardHeader>
          <CardContent>{renderVisualizer()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
