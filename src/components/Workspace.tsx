"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { EditorTabs } from "@/components/EditorTabs";
import { Preview } from "@/components/Preview";
import { Terminal, type TerminalLine } from "@/components/Terminal";
import { Toolbar } from "@/components/Toolbar";
import {
  type LangId,
  buildPreviewHtml,
  fileNameFor,
  getLanguage,
  runCommandFor,
} from "@/lib/languages";
import { runInteractiveJudge0 } from "@/lib/runInteractive";
import { runJavaScript } from "@/lib/runJs";
import {
  type EditorTab,
  createTab,
  tabDisplayName,
  tabEditorPath,
} from "@/lib/tabs";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function appendLines(
  items: Array<{ kind: TerminalLine["kind"]; text: string }>
): TerminalLine[] {
  return items.map((item) => ({ id: uid(), kind: item.kind, text: item.text }));
}

function updateTab(
  tabs: EditorTab[],
  tabId: string,
  patch: Partial<EditorTab> | ((tab: EditorTab) => Partial<EditorTab>)
): EditorTab[] {
  return tabs.map((t) => {
    if (t.id !== tabId) return t;
    const next = typeof patch === "function" ? patch(t) : patch;
    return { ...t, ...next };
  });
}

export function Workspace() {
  const first = useMemo(() => createTab("java"), []);
  const [tabs, setTabs] = useState<EditorTab[]>([first]);
  const [activeTabId, setActiveTabId] = useState(first.id);
  const [isRunning, setIsRunning] = useState(false);
  const [runningTabId, setRunningTabId] = useState<string | null>(null);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [editorRatio, setEditorRatio] = useState(0.62);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const runLockRef = useRef(false);
  const abortedRef = useRef(false);
  const inputResolverRef = useRef<((line: string) => void) | null>(null);
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  const language = useMemo(
    () => getLanguage(activeTab.langId),
    [activeTab.langId]
  );

  const displayName = useMemo(
    () => tabDisplayName(activeTab, tabs),
    [activeTab, tabs]
  );

  const editorPath = useMemo(
    () => tabEditorPath(activeTab, displayName),
    [activeTab, displayName]
  );

  const patchActive = useCallback(
    (patch: Partial<EditorTab> | ((tab: EditorTab) => Partial<EditorTab>)) => {
      setTabs((prev) => updateTab(prev, activeTabId, patch));
    },
    [activeTabId]
  );

  const patchTabById = useCallback(
    (
      tabId: string,
      patch: Partial<EditorTab> | ((tab: EditorTab) => Partial<EditorTab>)
    ) => {
      setTabs((prev) => updateTab(prev, tabId, patch));
    },
    []
  );

  const handleLanguageChange = useCallback(
    (id: LangId) => {
      const lang = getLanguage(id);
      patchActive({
        langId: id,
        code: lang.sample,
        lines: [],
        previewHtml: "",
        stdin: lang.defaultStdin,
      });
    },
    [patchActive]
  );

  const handleNewTab = useCallback((langId: LangId) => {
    const tab = createTab(langId);
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const handleCloseTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) return prev;
        const idx = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const fallback = next[Math.max(0, idx - 1)] ?? next[0];
          setActiveTabId(fallback.id);
        }
        return next;
      });
    },
    [activeTabId]
  );

  const clearOutput = useCallback(() => {
    patchActive({ lines: [], previewHtml: "" });
  }, [patchActive]);

  const clearCode = useCallback(() => {
    patchActive((tab) => ({
      code: "",
      previewHtml: "",
      lines: [
        ...tab.lines,
        ...appendLines([
          {
            kind: "system",
            text: "Editor cleared.",
          },
          { kind: "info", text: "" },
        ]),
      ],
    }));
  }, [patchActive]);

  const resetCode = useCallback(() => {
    const lang = getLanguage(activeTab.langId);
    patchActive((tab) => ({
      code: lang.sample,
      stdin: lang.defaultStdin,
      lines: [
        ...tab.lines,
        ...appendLines([
          {
            kind: "system",
            text: `${lang.label} sample code restored.`,
          },
          { kind: "info", text: "" },
        ]),
      ],
    }));
  }, [activeTab.langId, patchActive]);

  const appendToTab = useCallback(
    (
      tabId: string,
      items: Array<{ kind: TerminalLine["kind"]; text: string }>
    ) => {
      setTabs((prev) =>
        updateTab(prev, tabId, (tab) => ({
          lines: [...tab.lines, ...appendLines(items)],
        }))
      );
    },
    []
  );

  const clearInputWait = useCallback(() => {
    setWaitingForInput(false);
    inputResolverRef.current = null;
  }, []);

  const submitProgramInput = useCallback((line: string) => {
    const resolve = inputResolverRef.current;
    if (!resolve) return;
    inputResolverRef.current = null;
    setWaitingForInput(false);
    resolve(line);
  }, []);

  const cancelRun = useCallback(() => {
    abortedRef.current = true;
    const resolve = inputResolverRef.current;
    inputResolverRef.current = null;
    setWaitingForInput(false);
    // Unblock any pending readLine
    resolve?.("");
  }, []);

  const runInteractiveLanguage = useCallback(
    async (tabId: string, lang: LangId, source: string) => {
      const started = performance.now();
      const cmd = runCommandFor(lang, source);
      appendToTab(tabId, [{ kind: "system", text: cmd }]);

      const result = await runInteractiveJudge0(lang, source, {
        write: (kind, text) => {
          if (!text && kind !== "input") return;
          appendToTab(tabId, [{ kind, text }]);
        },
        readLine: () =>
          new Promise<string>((resolve) => {
            if (abortedRef.current) {
              resolve("");
              return;
            }
            setWaitingForInput(true);
            inputResolverRef.current = resolve;
          }),
        isAborted: () => abortedRef.current,
      });

      const elapsed = ((performance.now() - started) / 1000).toFixed(2);

      if (result.error && result.signal === "ABORTED") {
        appendToTab(tabId, [
          { kind: "error", text: "Process stopped." },
          { kind: "info", text: `Finished in ${elapsed}s` },
          { kind: "info", text: "" },
        ]);
        return;
      }

      if (result.error && !result.compileFailed) {
        appendToTab(tabId, [
          { kind: "error", text: `Error: ${result.error}` },
          { kind: "info", text: `Finished in ${elapsed}s` },
          { kind: "info", text: "" },
        ]);
        return;
      }

      const cpu = result.time ? `${result.time}s CPU` : null;
      const mem =
        result.memory != null
          ? `${Math.round(result.memory / 1024)} MB`
          : null;
      const stats = [cpu, mem].filter(Boolean).join(" · ");
      appendToTab(tabId, [
        {
          kind: "info",
          text: stats
            ? `Finished in ${elapsed}s (${stats})`
            : `Finished in ${elapsed}s`,
        },
        { kind: "info", text: "" },
      ]);
    },
    [appendToTab]
  );

  const runCode = useCallback(async () => {
    if (runLockRef.current) return;
    const tab = tabsRef.current.find((t) => t.id === activeTabId);
    if (!tab) return;

    runLockRef.current = true;
    abortedRef.current = false;
    clearInputWait();
    setRunningTabId(tab.id);
    setIsRunning(true);

    const lang = getLanguage(tab.langId);
    const fname = fileNameFor(tab.langId, tab.code);

    try {
      if (lang.runner === "preview") {
        const html = buildPreviewHtml(tab.langId, tab.code);
        patchTabById(tab.id, (t) => ({
          previewHtml: html,
          lines: [
            ...t.lines,
            ...appendLines([
              { kind: "system", text: `> preview ${fname}` },
              {
                kind: "success",
                text: `${lang.label} preview updated.`,
              },
              { kind: "info", text: "" },
            ]),
          ],
        }));
        return;
      }

      if (lang.runner === "browser-js") {
        const started = performance.now();
        appendToTab(tab.id, [{ kind: "system", text: `> node ${fname}` }]);
        const result = runJavaScript(tab.code);
        const elapsed = ((performance.now() - started) / 1000).toFixed(3);
        const next: Array<{ kind: TerminalLine["kind"]; text: string }> = [];
        if (result.logs.length) {
          for (const log of result.logs) next.push({ kind: "stdout", text: log });
        } else if (!result.errors.length) {
          next.push({ kind: "info", text: "(no output)" });
        }
        for (const err of result.errors) {
          next.push({ kind: "stderr", text: err });
        }
        next.push({
          kind: result.ok ? "success" : "error",
          text: result.ok
            ? "Process finished successfully"
            : "Process finished with errors",
        });
        next.push({ kind: "info", text: `Finished in ${elapsed}s` });
        next.push({ kind: "info", text: "" });
        appendToTab(tab.id, next);
        return;
      }

      // Java / Python / C / C++ — interactive terminal I/O (real IDE style)
      await runInteractiveLanguage(tab.id, tab.langId, tab.code);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      appendToTab(tab.id, [
        { kind: "error", text: `Request failed: ${message}` },
        { kind: "info", text: "" },
      ]);
    } finally {
      clearInputWait();
      setIsRunning(false);
      setRunningTabId(null);
      runLockRef.current = false;
    }
  }, [
    activeTabId,
    appendToTab,
    clearInputWait,
    patchTabById,
    runInteractiveLanguage,
  ]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const ratio = y / rect.height;
      setEditorRatio(Math.min(0.85, Math.max(0.25, ratio)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const target = e.target as HTMLElement | null;
        if (target?.closest?.(".monaco-editor")) return;
        e.preventDefault();
        void runCode();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t") {
        e.preventDefault();
        handleNewTab(activeTab.langId);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w") {
        e.preventDefault();
        handleCloseTab(activeTabId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runCode, handleNewTab, handleCloseTab, activeTab.langId, activeTabId]);

  const showPreview = language.outputMode === "preview";
  const runningThisTab = isRunning && runningTabId === activeTab.id;

  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <Toolbar
        language={language}
        fileName={displayName}
        isRunning={isRunning}
        onLanguageChange={handleLanguageChange}
        onRun={() => void runCode()}
        onClearCode={clearCode}
        onClearTerminal={clearOutput}
        onResetCode={resetCode}
      />

      <EditorTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onSelect={setActiveTabId}
        onClose={handleCloseTab}
        onNewTab={handleNewTab}
      />

      <div ref={containerRef} className="flex min-h-0 flex-1 flex-col">
        <div
          className="min-h-0 overflow-hidden"
          style={{ flex: `0 0 ${editorRatio * 100}%` }}
        >
          <CodeEditor
            value={activeTab.code}
            onChange={(value) => patchActive({ code: value })}
            onRun={() => void runCode()}
            language={language.monaco}
            fileName={displayName}
            langId={activeTab.langId}
            editorPath={editorPath}
          />
        </div>

        <div
          className="splitter relative z-10 h-1.5 shrink-0 cursor-row-resize bg-[var(--border)]"
          onMouseDown={() => {
            dragging.current = true;
            document.body.style.cursor = "row-resize";
            document.body.style.userSelect = "none";
          }}
          title="Drag to resize"
          role="separator"
          aria-orientation="horizontal"
        />

        <div className="min-h-0 flex-1 overflow-hidden">
          {showPreview ? (
            <Preview
              html={activeTab.previewHtml}
              label={
                activeTab.langId === "css" ? "CSS Preview" : "HTML Preview"
              }
              tabLabel={displayName}
            />
          ) : (
            <Terminal
              lines={activeTab.lines}
              isRunning={runningThisTab}
              waitingForInput={runningThisTab && waitingForInput}
              onSubmitInput={submitProgramInput}
              onCancelRun={cancelRun}
              tabLabel={displayName}
            />
          )}
        </div>
      </div>
    </div>
  );
}
