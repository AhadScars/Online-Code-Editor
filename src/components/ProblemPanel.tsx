"use client";

import type { Problem, TestRunResult } from "@/lib/problems";

type ProblemPanelProps = {
  problem: Problem;
  isRunning: boolean;
  results: TestRunResult[] | null;
  onRunTests: () => void;
  onClear: () => void;
};

export function ProblemPanel({
  problem,
  isRunning,
  results,
  onRunTests,
  onClear,
}: ProblemPanelProps) {
  const passed = results?.filter((r) => r.passed).length ?? 0;
  const total = results?.length ?? 0;
  const allPassed = results != null && total > 0 && passed === total;

  return (
    <div className="shrink-0 border-b border-[var(--border)] bg-[#252628]">
      <div className="flex flex-wrap items-start justify-between gap-2 px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-bright)]">
              {problem.title}
            </span>
            <span className="rounded bg-[#3d3f43] px-1.5 py-0.5 text-[10px] capitalize text-[var(--text)]">
              {problem.difficulty}
            </span>
            {results && (
              <span
                className={`text-[10px] font-semibold ${
                  allPassed ? "text-[var(--success)]" : "text-[var(--warning)]"
                }`}
              >
                {passed}/{total} passed
              </span>
            )}
          </div>
          <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-[var(--text-dim)]">
            {problem.description}
            {problem.constraints ? (
              <span className="mt-0.5 block text-[10px] opacity-80">
                Constraints: {problem.constraints}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRunTests}
            disabled={isRunning}
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? "Testing…" : "Run tests"}
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={isRunning}
            className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text)] hover:bg-[#3d3f43] disabled:opacity-50"
            title="Leave problem mode"
          >
            Close
          </button>
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-t border-[var(--border-soft)] px-3 py-2">
          {results.map((r) => (
            <div
              key={r.testId}
              className={`min-w-[8rem] max-w-[14rem] shrink-0 rounded-md border px-2 py-1.5 text-[10px] ${
                r.passed
                  ? "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
                  : "border-[var(--error)]/40 bg-[var(--error)]/10 text-[var(--error)]"
              }`}
              title={
                r.hidden
                  ? r.passed
                    ? "Hidden test passed"
                    : r.error || "Hidden test failed"
                  : r.error ||
                    (r.passed
                      ? "Passed"
                      : `Expected:\n${r.expected}\n\nGot:\n${r.actual}`)
              }
            >
              <div className="font-semibold">
                {r.passed ? "✓" : "✗"}{" "}
                {r.hidden ? "Hidden test" : r.label}
              </div>
              {!r.hidden && !r.passed && r.actual !== undefined && (
                <div className="mt-0.5 truncate font-mono opacity-80">
                  got: {r.actual.trim() || "(empty)"}
                </div>
              )}
              {(r.time || r.memory != null) && (
                <div className="mt-0.5 opacity-70">
                  {[
                    r.time ? `${r.time}s` : null,
                    r.memory != null
                      ? `${Math.round(r.memory / 1024)} MB`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
