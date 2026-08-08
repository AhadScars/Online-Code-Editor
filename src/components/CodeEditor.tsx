"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useCallback } from "react";
import type { LangId } from "@/lib/languages";
import { usesWideTabs } from "@/lib/languages";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  language: string;
  fileName: string;
  langId: LangId;
  editorPath: string;
};

export function CodeEditor({
  value,
  onChange,
  onRun,
  language,
  fileName,
  langId,
  editorPath,
}: CodeEditorProps) {
  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        () => onRun()
      );
      editor.focus();
    },
    [onRun]
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
        background: "#1e1f22",
      }}
    >
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        path={editorPath}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        loading={
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6f737a",
              fontSize: 14,
            }}
          >
            Loading editor…
          </div>
        }
        options={{
          fontSize: 14,
          fontFamily:
            "var(--font-geist-mono), 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: true, scale: 1 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: usesWideTabs(langId) ? 4 : 2,
          insertSpaces: true,
          wordWrap: "on",
          lineNumbers: "on",
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          padding: { top: 8, bottom: 8 },
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          formatOnPaste: true,
        }}
      />
      <span className="sr-only">{fileName}</span>
    </div>
  );
}
