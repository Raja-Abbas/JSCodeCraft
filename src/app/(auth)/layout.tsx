import { Code2 } from "lucide-react";

const jsFacts = [
  "JavaScript was created in just 10 days by Brendan Eich in 1995.",
  "JS was originally called Mocha, then LiveScript, before becoming JavaScript.",
  "JavaScript powers 98% of all websites on the internet.",
  "Node.js brought JavaScript to the server-side in 2009.",
  "JavaScript has over 1.7 million packages on npm.",
  "React, Vue, and Angular are the most popular JS frameworks.",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const displayFacts = jsFacts.slice(0, 3);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-transparent to-teal-600/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-16 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Code2 size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              JS<span className="text-cyan-400">CodeCraft</span>
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            AI-Powered JavaScript{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Code Review
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Analyze, optimize, and understand your JavaScript code with the power
            of AI-driven insights.
          </p>

          <div className="space-y-4">
            {displayFacts.map((fact, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-mono mr-2">{"// "}</span>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f172a]">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
