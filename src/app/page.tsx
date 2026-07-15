"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import {
  Code2,
  Search,
  Gauge,
  GitBranch,
  FileCode,
  Wrench,
  GitCompare,
  MessageSquare,
  BookOpen,
  Bug,
  ArrowRight,
  Upload,
  Sparkles,
  BarChart3,
  Zap,
  Shield,
  BrainCircuit,
} from "lucide-react";

const features = [
  { title: "Code Review", desc: "AI-driven code analysis with actionable suggestions.", icon: Code2, href: "/dashboard" },
  { title: "Static Analysis", desc: "Deep static analysis for bugs, patterns, and code smells.", icon: Search, href: "/dashboard/static-analysis" },
  { title: "Performance", desc: "Identify bottlenecks and optimize your code.", icon: Gauge, href: "/dashboard/performance" },
  { title: "Visualizer", desc: "Visual breakdown of code execution flow.", icon: GitBranch, href: "/dashboard/visualizer" },
  { title: "AST Explorer", desc: "Interactive abstract syntax tree visualization.", icon: FileCode, href: "/dashboard/ast" },
  { title: "Refactoring", desc: "Smart refactoring suggestions with one-click apply.", icon: Wrench, href: "/dashboard/refactoring" },
  { title: "Diff Viewer", desc: "Side-by-side code diff comparison.", icon: GitCompare, href: "/dashboard/diff" },
  { title: "Interview Mode", desc: "Practice coding interviews with AI feedback.", icon: MessageSquare, href: "/dashboard/interview" },
  { title: "Quiz", desc: "Test your JS knowledge with interactive quizzes.", icon: BookOpen, href: "/dashboard/quiz" },
];

const steps = [
  { step: "01", title: "Upload Code", desc: "Paste your JavaScript or TypeScript code into the editor.", icon: Upload },
  { step: "02", title: "AI Analysis", desc: "Our AI engine scans for issues, patterns, and optimizations.", icon: BrainCircuit },
  { step: "03", title: "Get Insights", desc: "Review detailed reports with actionable recommendations.", icon: BarChart3 },
];

const techStack = [
  { name: "Next.js", icon: Zap },
  { name: "TypeScript", icon: FileCode },
  { name: "OpenAI", icon: Sparkles },
  { name: "CodeMirror", icon: Code2 },
  { name: "Prisma", icon: Shield },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a1628]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#tools" className="text-sm text-slate-400 hover:text-white transition-colors">
              Tools
            </a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium shadow-lg shadow-cyan-500/20">
                Launch Tools
                <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-sm font-medium mb-8">
            <Sparkles size={14} />
            Powered by Advanced AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            AI-Powered{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300">
              JavaScript
            </span>
            <br />
            Code Review
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyze, optimize, and understand your JavaScript &amp; TypeScript code
            with AI-driven insights, AST exploration, and interactive learning tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium shadow-lg shadow-cyan-500/25 px-8">
                Launch Tools Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                master JavaScript
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A comprehensive suite of AI-powered tools for code review, learning, and optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <div className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all h-full cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                      <Icon size={20} className="text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="tools" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Three simple steps to better code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center relative">
                  <div className="text-6xl font-bold text-white/[0.04] mb-4">{step.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-teal-500/15 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with modern tech
            </h2>
            <p className="text-slate-400 text-lg">
              Powered by the best tools in the JavaScript ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/30 transition-colors"
                >
                  <Icon size={18} className="text-cyan-400" />
                  <span className="text-sm font-medium text-slate-300">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-[#0a1628] to-teal-600/20" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to level up your code?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                Join thousands of developers using AI-powered insights to write better JavaScript.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium shadow-lg shadow-cyan-500/25 px-8">
                    Launch Tools Free
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
                Pricing
              </a>
            </nav>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} JSCodeCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
