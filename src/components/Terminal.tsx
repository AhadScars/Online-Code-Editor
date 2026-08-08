"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

export type TerminalLine = {
  id: string;
  kind:
    | "info"
    | "stdout"
    | "stderr"
    | "system"
    | "error"
    | "success"
    | "input";
  text: string;
};

type TerminalProps = {
  lines: TerminalLine[];
  isRunning: boolean;
  /** Program is blocked on stdin — show live input like a real IDE */
  waitingForInput?: boolean;
  onSubmitInput?: (line: string) => void;
  onCancelRun?: () => void;
  tabLabel?: string;
};

const KIND_CLASS: Record<TerminalLine["kind"], string> = {
  info: "text-[var(--text-dim)]",
  system: "text-[#7aa2f7]",
  stdout: "text-[#c0caf5]",
  stderr: "text-[var(--error)]",
  error: "text-[var(--error)]",
  success: "text-[var(--success)]",
  input: "text-[#e0af68]",
};

export function Terminal({
  lines,
  isRunning,
  waitingForInput = false,
  onSubmitInput,
  onCancelRun,
  tabLabel,
}: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, waitingForInput]);

  useEffect(() => {
    if (waitingForInput) {
      setDraft("");
      // Focus after paint so the field is enabled
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    setDraft("");
  }, [waitingForInput]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!waitingForInput || !onSubmitInput) return;
    onSubmitInput(draft);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "c" && e.ctrlKey && onCancelRun) {
      e.preventDefault();
      onCancelRun();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--bg-terminal)]">
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-[var(--border-soft)] bg-[var(--bg-tab)] px-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-[var(--text-bright)]">
          <TerminalIcon />
          <span>Terminal</span>
          {tabLabel && (
            <span className="truncate font-mono text-[10px] text-[var(--text-dim)]">
              · {tabLabel}
            </span>
          )}
          {isRunning && !waitingForInput && (
            <span className="running-pulse shrink-0 rounded bg-[#3d3f43] px-1.5 py-0.5 text-[10px] text-[var(--warning)]">
              executing
            </span>
          )}
          {waitingForInput && (
            <span className="shrink-0 rounded bg-[#3d3f43] px-1.5 py-0.5 text-[10px] text-[#e0af68]">
              waiting for input
            </span>
          )}
        </div>
        <span className="shrink-0 text-[10px] text-[var(--text-dim)]">
          {waitingForInput
            ? "type a value · Enter to send · Ctrl+C cancel"
            : "stdout · stderr · compile"}
        </span>
      </div>

      <div className="terminal-output min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[12.5px] leading-relaxed">
        {lines.length === 0 && !waitingForInput ? (
          <div className="text-[var(--text-dim)]">
            Ready. Press <kbd className="rounded bg-[#2a2a2a] px-1">Run</kbd> or{" "}
            <kbd className="rounded bg-[#2a2a2a] px-1">Ctrl/Cmd+Enter</kbd>.
            
          </div>
        ) : (
          lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap break-words ${KIND_CLASS[line.kind]}`}
            >
              {line.kind === "input" ? (
                <>
                  <span className="text-[var(--text-dim)]">‹ </span>
                  {line.text}
                </>
              ) : (
                line.text
              )}
            </div>
          ))
        )}

        {waitingForInput && (
          <form
            onSubmit={submit}
            className="mt-0.5 flex items-center gap-1 font-mono text-[12.5px]"
          >
            <span className="shrink-0 text-[#e0af68]">›</span>
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Program input"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#e0af68] outline-none"
              placeholder="type input here…"
            />
            <span className="inline-block h-3.5 w-1.5 animate-pulse bg-[#e0af68]" />
          </form>
        )}

        <div ref={bottomRef} />
      </div>

      {isRunning && (
        <div className="flex shrink-0 items-center justify-between border-t border-[var(--border-soft)] bg-[#121212] px-3 py-1.5">
          <span className="text-[10px] text-[var(--text-dim)]">
            {waitingForInput
              ? "Program is waiting for your input"
              : "Program running…"}
          </span>
          {onCancelRun && (
            <button
              type="button"
              onClick={onCancelRun}
              className="rounded border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text)] hover:bg-[#2a2a2a]"
            >
              Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TerminalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}
