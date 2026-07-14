"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Search,
  Gauge,
  GitBranch,
  FileCode,
  Wrench,
  GitCompare,
  MessageSquare,
  Bug,
  Settings,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import Logo from "./logo";

const navItems = [
  { label: "Code Review", href: "/dashboard", icon: Code2 },
  { label: "Static Analysis", href: "/dashboard/static-analysis", icon: Search },
  { label: "Performance", href: "/dashboard/performance", icon: Gauge },
  { label: "Visualizer", href: "/dashboard/visualizer", icon: GitBranch },
  { label: "AST Explorer", href: "/dashboard/ast", icon: FileCode },
  { label: "Refactoring", href: "/dashboard/refactoring", icon: Wrench },
  { label: "Diff Viewer", href: "/dashboard/diff", icon: GitCompare },
  { label: "Interview Mode", href: "/dashboard/interview", icon: MessageSquare },
  { label: "Quiz", href: "/dashboard/quiz", icon: BookOpen },
  { label: "Bug Hunter", href: "/dashboard/bug-hunter", icon: Bug },
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  function NavList() {
    return (
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={active ? "text-cyan-400" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  function BottomNav() {
    return (
      <div className="border-t border-white/10 px-3 py-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-[#0a1628] border border-white/10 text-white"
      >
        <Menu size={20} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0a1628] border-r border-white/10 flex flex-col transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <Logo size="sm" />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <NavList />
        <BottomNav />
      </aside>
    </>
  );
}
