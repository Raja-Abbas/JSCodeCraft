"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Code2,
  Braces,
  Variable,
  FunctionSquare,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface ASTNode {
  type: string;
  name?: string;
  value?: string;
  start?: number;
  end?: number;
  children?: ASTNode[];
  property?: string;
  computed?: boolean;
  params?: string[];
  operator?: string;
}

const sampleSnippets: Record<string, { code: string; ast: ASTNode }> = {
  "Function Declaration": {
    code: `function greet(name) {
  const message = "Hello, " + name;
  return message;
}`,
    ast: {
      type: "Program",
      start: 0,
      end: 67,
      children: [
        {
          type: "FunctionDeclaration",
          name: "greet",
          start: 0,
          end: 67,
          params: ["name"],
          children: [
            {
              type: "BlockStatement",
              start: 19,
              end: 67,
              children: [
                {
                  type: "VariableDeclaration",
                  name: "message",
                  start: 23,
                  end: 59,
                  children: [
                    {
                      type: "BinaryExpression",
                      operator: "+",
                      start: 41,
                      end: 58,
                      children: [
                        { type: "Literal", value: '"Hello, "', start: 41, end: 50 },
                        { type: "Identifier", name: "name", start: 53, end: 57 },
                      ],
                    },
                  ],
                },
                {
                  type: "ReturnStatement",
                  start: 61,
                  end: 67,
                  children: [
                    { type: "Identifier", name: "message", start: 68, end: 75 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  "Arrow Function": {
    code: `const add = (a, b) => a + b;`,
    ast: {
      type: "Program",
      start: 0,
      end: 28,
      children: [
        {
          type: "VariableDeclaration",
          name: "add",
          start: 0,
          end: 28,
          children: [
            {
              type: "ArrowFunctionExpression",
              params: ["a", "b"],
              start: 13,
              end: 28,
              children: [
                {
                  type: "BinaryExpression",
                  operator: "+",
                  start: 22,
                  end: 27,
                  children: [
                    { type: "Identifier", name: "a", start: 22, end: 23 },
                    { type: "Identifier", name: "b", start: 26, end: 27 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  "Async/Await": {
    code: `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}`,
    ast: {
      type: "Program",
      start: 0,
      end: 94,
      children: [
        {
          type: "FunctionDeclaration",
          name: "fetchUser",
          start: 0,
          end: 94,
          params: ["id"],
          children: [
            {
              type: "BlockStatement",
              start: 31,
              end: 94,
              children: [
                {
                  type: "VariableDeclaration",
                  name: "res",
                  start: 35,
                  end: 76,
                  children: [
                    {
                      type: "AwaitExpression",
                      start: 48,
                      end: 75,
                      children: [
                        {
                          type: "CallExpression",
                          name: "fetch",
                          start: 54,
                          end: 75,
                          children: [
                            { type: "TemplateLiteral", value: "`/api/users/${id}`", start: 60, end: 75 },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "ReturnStatement",
                  start: 80,
                  end: 94,
                  children: [
                    {
                      type: "CallExpression",
                      name: "res.json",
                      start: 87,
                      end: 93,
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  "Class Declaration": {
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " makes a noise";
  }
}`,
    ast: {
      type: "Program",
      start: 0,
      end: 97,
      children: [
        {
          type: "ClassDeclaration",
          name: "Animal",
          start: 0,
          end: 97,
          children: [
            {
              type: "MethodDefinition",
              name: "constructor",
              start: 15,
              end: 54,
              params: ["name"],
              children: [
                {
                  type: "ExpressionStatement",
                  start: 39,
                  end: 54,
                  children: [
                    {
                      type: "AssignmentExpression",
                      operator: "=",
                      start: 39,
                      end: 54,
                      children: [
                        { type: "MemberExpression", property: "name", start: 39, end: 49 },
                        { type: "Identifier", name: "name", start: 52, end: 56 },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "MethodDefinition",
              name: "speak",
              start: 59,
              end: 95,
              children: [
                {
                  type: "ReturnStatement",
                  start: 75,
                  end: 95,
                  children: [
                    {
                      type: "BinaryExpression",
                      operator: "+",
                      start: 82,
                      end: 94,
                      children: [
                        { type: "MemberExpression", property: "name", start: 82, end: 92 },
                        { type: "Literal", value: '" makes a noise"', start: 95, end: 112 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

const nodeIcons: Record<string, React.ReactNode> = {
  Program: <FileCode className="h-3.5 w-3.5 text-cyan-400" />,
  FunctionDeclaration: <FunctionSquare className="h-3.5 w-3.5 text-violet-400" />,
  ArrowFunctionExpression: <FunctionSquare className="h-3.5 w-3.5 text-violet-400" />,
  VariableDeclaration: <Variable className="h-3.5 w-3.5 text-emerald-400" />,
  BlockStatement: <Braces className="h-3.5 w-3.5 text-amber-400" />,
  ExpressionStatement: <MessageSquare className="h-3.5 w-3.5 text-blue-400" />,
  ReturnStatement: <ArrowRight className="h-3.5 w-3.5 text-rose-400" />,
  CallExpression: <Code2 className="h-3.5 w-3.5 text-pink-400" />,
  Identifier: <Code2 className="h-3.5 w-3.5 text-slate-400" />,
  Literal: <Code2 className="h-3.5 w-3.5 text-slate-400" />,
  BinaryExpression: <Code2 className="h-3.5 w-3.5 text-orange-400" />,
  ClassDeclaration: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
  MethodDefinition: <Code2 className="h-3.5 w-3.5 text-violet-400" />,
  MemberExpression: <Code2 className="h-3.5 w-3.5 text-blue-400" />,
  AssignmentExpression: <Code2 className="h-3.5 w-3.5 text-emerald-400" />,
  AwaitExpression: <Code2 className="h-3.5 w-3.5 text-amber-400" />,
  TemplateLiteral: <Code2 className="h-3.5 w-3.5 text-green-400" />,
};

const typeColors: Record<string, string> = {
  Program: "border-cyan-500/30",
  FunctionDeclaration: "border-violet-500/30",
  ArrowFunctionExpression: "border-violet-500/30",
  VariableDeclaration: "border-emerald-500/30",
  BlockStatement: "border-amber-500/30",
  ExpressionStatement: "border-blue-500/30",
  ReturnStatement: "border-rose-500/30",
  CallExpression: "border-pink-500/30",
  Identifier: "border-slate-500/30",
  Literal: "border-slate-500/30",
  BinaryExpression: "border-orange-500/30",
  ClassDeclaration: "border-cyan-500/30",
  MethodDefinition: "border-violet-500/30",
  MemberExpression: "border-blue-500/30",
  AssignmentExpression: "border-emerald-500/30",
  AwaitExpression: "border-amber-500/30",
  TemplateLiteral: "border-green-500/30",
};

function TreeNode({ node, depth = 0 }: { node: ASTNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        className={`flex items-center gap-1.5 py-0.5 px-2 rounded hover:bg-muted/50 cursor-pointer text-xs group ${
          depth === 0 ? "" : ""
        }`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-3 h-3 shrink-0" />
        )}

        {nodeIcons[node.type] || <Code2 className="h-3.5 w-3.5 text-slate-400" />}

        <Badge
          variant="outline"
          className={`text-[10px] py-0 px-1.5 font-mono ${typeColors[node.type] || "border-slate-500/30"}`}
        >
          {node.type}
        </Badge>

        {node.name && (
          <span className="font-mono text-foreground font-medium">{node.name}</span>
        )}

        {node.value && (
          <span className="font-mono text-emerald-400/70">{node.value}</span>
        )}

        {node.operator && (
          <span className="font-mono text-orange-400">{node.operator}</span>
        )}

        {node.params && (
          <span className="text-muted-foreground text-[10px]">
            ({node.params.join(", ")})
          </span>
        )}

        {node.property && (
          <span className="font-mono text-blue-400/70">.{node.property}</span>
        )}

        {node.start !== undefined && node.end !== undefined && (
          <span className="ml-auto text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
            [{node.start}:{node.end}]
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNode key={`${child.type}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ASTExplorerPage() {
  const [selectedSnippet, setSelectedSnippet] = useState("Function Declaration");
  const sample = sampleSnippets[selectedSnippet];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AST Explorer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore the Abstract Syntax Tree of JavaScript code
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedSnippet}
              onChange={(e) => setSelectedSnippet(e.target.value)}
              className="appearance-none bg-background border rounded-md px-3 py-1.5 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {Object.keys(sampleSnippets).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" />
              Source Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-background/50 border rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {sample.code}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Braces className="h-4 w-4 text-violet-400" />
              AST Tree
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-3 max-h-[500px] overflow-y-auto font-mono text-xs">
              <TreeNode node={sample.ast} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-muted/50">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">
            The <strong className="text-cyan-400">Abstract Syntax Tree</strong> is a tree representation of the source code structure. Each node represents a syntactic construct — declarations, expressions, statements. Parsers like <code>acorn</code>, <code>esprima</code>, or <code>@babel/parser</code> produce this tree from source code.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
