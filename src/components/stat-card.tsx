"use client";

import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: string;
}

const colorMap: Record<string, string> = {
  cyan: "bg-cyan-500/15 text-cyan-400",
  green: "bg-emerald-500/15 text-emerald-400",
  red: "bg-red-500/15 text-red-400",
  yellow: "bg-yellow-500/15 text-yellow-400",
  purple: "bg-purple-500/15 text-purple-400",
  blue: "bg-blue-500/15 text-blue-400",
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "cyan",
}: StatCardProps) {
  const iconClasses = colorMap[color] || colorMap.cyan;

  return (
    <Card className="p-5 border border-white/10 bg-[#0f172a] hover:border-cyan-500/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {change && (
            <p className="text-xs text-slate-500">{change}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${iconClasses}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
