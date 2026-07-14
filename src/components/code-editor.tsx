"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { Card } from "@/components/ui/card";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: "javascript" | "typescript";
  height?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "500px",
}: CodeEditorProps) {
  return (
    <Card className="overflow-hidden border border-white/10 bg-[#1e1e2e]">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[javascript({ typescript: language === "typescript" })]}
        onChange={(val) => onChange?.(val)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        className="text-sm font-mono"
      />
    </Card>
  );
}
