'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Code2,
  Gauge,
  Zap,
  Search,
} from 'lucide-react';

const stats = [
  {
    title: 'Analyses Run',
    value: '1,247',
    change: '+12%',
    icon: Activity,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
  },
  {
    title: 'Issues Found',
    value: '3,891',
    change: '-5%',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    title: 'Score Avg',
    value: '84.2',
    change: '+3.1',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    title: 'Time Saved',
    value: '42h',
    change: '+8h',
    icon: Clock,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
  },
];

const recentActivity = [
  {
    id: 1,
    tool: 'Static Analyzer',
    file: 'auth.controller.js',
    issues: 7,
    score: 72,
    time: '2 min ago',
    icon: Search,
  },
  {
    id: 2,
    tool: 'Performance Analyzer',
    file: 'dataProcessor.ts',
    issues: 3,
    score: 88,
    time: '15 min ago',
    icon: Gauge,
  },
  {
    id: 3,
    tool: 'Static Analyzer',
    file: 'utils/helpers.js',
    issues: 12,
    score: 58,
    time: '1 hour ago',
    icon: Search,
  },
  {
    id: 4,
    tool: 'Performance Analyzer',
    file: 'apiClient.ts',
    issues: 2,
    score: 91,
    time: '3 hours ago',
    icon: Gauge,
  },
  {
    id: 5,
    tool: 'Static Analyzer',
    file: 'components/Dashboard.tsx',
    issues: 0,
    score: 100,
    time: '5 hours ago',
    icon: Search,
  },
];

const quickActions = [
  {
    title: 'Static Analyzer',
    description: 'Detect code smells, anti-patterns, and potential bugs',
    icon: Code2,
    href: '/dashboard/static-analysis',
    color: 'from-cyan-500 to-teal-600',
  },
  {
    title: 'Performance Analyzer',
    description: 'Analyze time/space complexity and optimization opportunities',
    icon: Gauge,
    href: '/dashboard/performance',
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'AI Review',
    description: 'Get AI-powered suggestions for code improvements',
    icon: Zap,
    href: '/dashboard/ai-review',
    color: 'from-amber-500 to-orange-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of your code analysis activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-emerald-600">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                        <activity.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.file}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.tool}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge
                          variant={activity.score >= 80 ? 'default' : 'destructive'}
                        >
                          Score: {activity.score}
                        </Badge>
                        <p className="mt-1 text-xs text-gray-500">
                          {activity.issues} issues
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4"
                  >
                    <div
                      className={`rounded-lg bg-gradient-to-br p-2 text-white ${action.color}`}
                    >
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
