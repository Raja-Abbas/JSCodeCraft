"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeConfig = {
  sm: { box: "h-8 w-8", icon: 16, text: "text-lg" },
  md: { box: "h-10 w-10", icon: 20, text: "text-xl" },
  lg: { box: "h-12 w-12", icon: 24, text: "text-2xl" },
};

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div
        className={`${config.box} rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow`}
      >
        <Code2
          size={config.icon}
          className="text-white"
          strokeWidth={2.5}
        />
      </div>
      {showText && (
        <span
          className={`${config.text} font-bold text-white tracking-tight hidden sm:inline`}
        >
          JS<span className="text-cyan-400">CodeCraft</span>
        </span>
      )}
    </Link>
  );
}
