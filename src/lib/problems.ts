import type { LangId } from "@/lib/languages";

export type ProblemTest = {
  id: string;
  /** Shown to students */
  label: string;
  stdin: string;
  /** Expected stdout (trimmed comparison) */
  expected: string;
  /** Hidden from UI when true */
  hidden?: boolean;
};

export type Problem = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  langId: LangId;
  /** Markdown-ish plain text description */
  description: string;
  /** Hints / constraints */
  constraints?: string;
  starterCode: string;
  tests: ProblemTest[];
};

export const PROBLEMS: Problem[] = [
  {
    id: "sum-two",
    title: "Sum of Two Numbers",
    difficulty: "easy",
    langId: "python",
    description:
      "Read two integers a and b from standard input (one per line) and print their sum.",
    constraints: "−10^9 ≤ a, b ≤ 10^9",
    starterCode: `a = int(input())
b = int(input())
# TODO: print a + b
`,
    tests: [
      { id: "t1", label: "Sample 1", stdin: "2\n3\n", expected: "5" },
      { id: "t2", label: "Sample 2", stdin: "10\n-4\n", expected: "6" },
      {
        id: "t3",
        label: "Hidden large",
        stdin: "1000000000\n1000000000\n",
        expected: "2000000000",
        hidden: true,
      },
    ],
  },
  {
    id: "even-or-odd",
    title: "Even or Odd",
    difficulty: "easy",
    langId: "java",
    description:
      "Read one integer n. Print \"even\" if n is even, otherwise print \"odd\" (lowercase, no quotes).",
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // TODO: print "even" or "odd"
        sc.close();
    }
}
`,
    tests: [
      { id: "t1", label: "Even", stdin: "4\n", expected: "even" },
      { id: "t2", label: "Odd", stdin: "7\n", expected: "odd" },
      { id: "t3", label: "Zero", stdin: "0\n", expected: "even", hidden: true },
    ],
  },
  {
    id: "max-of-three",
    title: "Maximum of Three",
    difficulty: "easy",
    langId: "cpp",
    description:
      "Read three integers a, b, c (space-separated on one line). Print the maximum.",
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    // TODO: print max(a, b, c)
    return 0;
}
`,
    tests: [
      { id: "t1", label: "Sample 1", stdin: "1 5 3\n", expected: "5" },
      { id: "t2", label: "Sample 2", stdin: "9 2 9\n", expected: "9" },
      {
        id: "t3",
        label: "Negatives",
        stdin: "-1 -8 -3\n",
        expected: "-1",
        hidden: true,
      },
    ],
  },
  {
    id: "fizzbuzz-n",
    title: "FizzBuzz to N",
    difficulty: "medium",
    langId: "go",
    description:
      'Read integer n. For each i from 1 to n (inclusive), print on its own line: "FizzBuzz" if divisible by 15, "Fizz" if by 3, "Buzz" if by 5, otherwise i.',
    starterCode: `package main

import "fmt"

func main() {
	var n int
	fmt.Scan(&n)
	// TODO: FizzBuzz 1..n
}
`,
    tests: [
      {
        id: "t1",
        label: "n = 5",
        stdin: "5\n",
        expected: "1\n2\nFizz\n4\nBuzz",
      },
      {
        id: "t2",
        label: "n = 15",
        stdin: "15\n",
        expected:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "easy",
    langId: "php",
    description:
      "Read one line of text and print it reversed. Do not add extra spaces or newlines beyond the reversed text.",
    starterCode: `<?php
$line = trim(fgets(STDIN));
// TODO: print reverse of $line
echo $line;
`,
    tests: [
      { id: "t1", label: "hello", stdin: "hello\n", expected: "olleh" },
      { id: "t2", label: "abc", stdin: "abc\n", expected: "cba" },
    ],
  },
  {
    id: "ts-sum-array",
    title: "Sum an Array (TypeScript)",
    difficulty: "easy",
    langId: "typescript",
    description:
      "Given the array below, print the sum of all numbers on a single line. Edit only the computation if needed.",
    starterCode: `const nums: number[] = [3, 7, 2, 9, 4];
// TODO: print the sum of nums
const sum = 0;
console.log(sum);
`,
    tests: [
      { id: "t1", label: "Fixed array", stdin: "", expected: "25" },
    ],
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    difficulty: "easy",
    langId: "ruby",
    description:
      'Read one line. Print the number of vowels (a, e, i, o, u) case-insensitive. "y" is not a vowel.',
    starterCode: `line = gets.to_s
# TODO: count vowels and print the number
`,
    tests: [
      { id: "t1", label: "hello", stdin: "hello\n", expected: "2" },
      { id: "t2", label: "AEIOU", stdin: "AEIOU\n", expected: "5" },
      {
        id: "t3",
        label: "rhythm",
        stdin: "rhythm\n",
        expected: "0",
        hidden: true,
      },
    ],
  },
  {
    id: "sql-top-students",
    title: "SQL: Top Students",
    difficulty: "medium",
    langId: "sql",
    description:
      "A table `scores(name TEXT, score INTEGER)` already has data inserted in the starter. Write a query that returns names with score ≥ 90, ordered by score descending.",
    starterCode: `CREATE TABLE scores (
  name TEXT,
  score INTEGER
);

INSERT INTO scores VALUES
  ('Ada', 95),
  ('Grace', 88),
  ('Alan', 91),
  ('Lin', 70);

-- TODO: select name, score where score >= 90 order by score desc
`,
    tests: [
      {
        id: "t1",
        label: "Query output",
        stdin: "",
        expected: "Ada|95\nAlan|91",
      },
    ],
  },
  {
    id: "rust-factorial",
    title: "Factorial",
    difficulty: "medium",
    langId: "rust",
    description: "Read one integer n (0 ≤ n ≤ 12). Print n!.",
    starterCode: `use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    let line = stdin.lock().lines().next().unwrap().unwrap();
    let n: u64 = line.trim().parse().unwrap();
    // TODO: print n!
    println!("{}", n);
}
`,
    tests: [
      { id: "t1", label: "5!", stdin: "5\n", expected: "120" },
      { id: "t2", label: "0!", stdin: "0\n", expected: "1" },
      { id: "t3", label: "10!", stdin: "10\n", expected: "3628800", hidden: true },
    ],
  },
];

export function getProblem(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id === id);
}

/** Normalize stdout for test comparison. */
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trimEnd()
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function outputsMatch(actual: string, expected: string): boolean {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

export type TestRunResult = {
  testId: string;
  label: string;
  hidden?: boolean;
  passed: boolean;
  actual: string;
  expected: string;
  time?: string | null;
  memory?: number | null;
  error?: string;
};

export async function runProblemTests(
  problem: Problem,
  code: string
): Promise<TestRunResult[]> {
  const results: TestRunResult[] = [];

  for (const test of problem.tests) {
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          stdin: test.stdin,
          language: problem.langId,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        compile?: { failed: boolean; stderr: string };
        run?: {
          stdout: string;
          stderr: string;
          code: number | null;
          time?: string | null;
          memory?: number | null;
        };
      };

      if (!data.ok) {
        results.push({
          testId: test.id,
          label: test.label,
          hidden: test.hidden,
          passed: false,
          actual: "",
          expected: test.expected,
          error: data.error || "Run failed",
        });
        continue;
      }

      if (data.compile?.failed) {
        results.push({
          testId: test.id,
          label: test.label,
          hidden: test.hidden,
          passed: false,
          actual: "",
          expected: test.expected,
          error: data.compile.stderr || "Compilation failed",
        });
        // No point continuing if compile fails
        for (const rest of problem.tests.slice(results.length)) {
          results.push({
            testId: rest.id,
            label: rest.label,
            hidden: rest.hidden,
            passed: false,
            actual: "",
            expected: rest.expected,
            error: "Skipped (compile error)",
          });
        }
        break;
      }

      const actual = data.run?.stdout ?? "";
      const passed = outputsMatch(actual, test.expected);
      results.push({
        testId: test.id,
        label: test.label,
        hidden: test.hidden,
        passed,
        actual,
        expected: test.expected,
        time: data.run?.time,
        memory: data.run?.memory,
        error: !passed && data.run?.stderr ? data.run.stderr : undefined,
      });
    } catch (err) {
      results.push({
        testId: test.id,
        label: test.label,
        hidden: test.hidden,
        passed: false,
        actual: "",
        expected: test.expected,
        error: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  return results;
}
