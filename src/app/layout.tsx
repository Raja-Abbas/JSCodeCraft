import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = "https://jscodecraft.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "JSCodeCraft — AI-Powered JavaScript Code Review & Performance Analysis",
    template: "%s | JSCodeCraft",
  },
  description:
    "AI-powered JavaScript code review platform. Analyze code for bugs, security issues, performance bottlenecks, and anti-patterns. Interactive JS visualizer, AST explorer, refactoring engine, and interview prep tools.",
  keywords: [
    "javascript code review",
    "AI code analysis",
    "code review tool",
    "javascript performance",
    "code analyzer",
    "static analysis",
    "AST explorer",
    "refactoring tool",
    "javascript visualizer",
    "developer tools",
  ],
  authors: [{ name: "JSCodeCraft" }],
  creator: "JSCodeCraft",
  publisher: "JSCodeCraft",
  openGraph: {
    title: "JSCodeCraft — AI-Powered JavaScript Code Review & Performance Analysis",
    description:
      "AI-powered JavaScript code review. Analyze bugs, security, performance, and anti-patterns. Interactive visualizer and refactoring engine.",
    type: "website",
    siteName: "JSCodeCraft",
    url: baseUrl,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "JSCodeCraft" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSCodeCraft — AI-Powered JavaScript Code Review",
    description: "AI-powered JavaScript code review. Analyze bugs, security, performance, and anti-patterns.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: [{ url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
