export type LangId =
  | "java"
  | "python"
  | "c"
  | "cpp"
  | "javascript"
  | "html"
  | "css";

export type LanguageConfig = {
  id: LangId;
  label: string;
  /** Monaco editor language id */
  monaco: string;
  fileName: string;
  /** Bottom pane mode */
  outputMode: "terminal" | "preview";
  /** How code is executed */
  runner: "judge0" | "browser-js" | "preview";
  /** Show stdin panel in terminal */
  supportsStdin: boolean;
  /** Sample stdin prefilled for input demos */
  defaultStdin: string;
  /** Hint shown above the stdin box */
  stdinHint: string;
  badgeColor: string;
  sample: string;
};

export const LANGUAGES: LanguageConfig[] = [
  {
    id: "java",
    label: "Java",
    monaco: "java",
    fileName: "Main.java",
    outputMode: "terminal",
    runner: "judge0",
    supportsStdin: true,
    defaultStdin: "",
    stdinHint: "Scanner — type in terminal while running",
    badgeColor: "#e8bf6a",
    sample: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        System.out.print("Enter a number: ");
        int n = sc.nextInt();

        System.out.println("Hello, " + name + "!");
        System.out.println("Double is: " + (n * 2));

        sc.close();
    }
}
`,
  },
  {
    id: "python",
    label: "Python",
    monaco: "python",
    fileName: "main.py",
    outputMode: "terminal",
    runner: "judge0",
    supportsStdin: true,
    defaultStdin: "",
    stdinHint: "input() — during Run, type in the terminal",
    badgeColor: "#3572a5",
    sample: `
name = input("Enter your name: ")
n = int(input("Enter a number: "))

print(f"Hello, {name}!")
print(f"Double is: {n * 2}")
`,
  },
  {
    id: "c",
    label: "C",
    monaco: "c",
    fileName: "main.c",
    outputMode: "terminal",
    runner: "judge0",
    supportsStdin: true,
    defaultStdin: "",
    stdinHint: "scanf — during Run, type in the terminal",
    badgeColor: "#555555",
    sample: `#include <stdio.h>

int main(void) {
    char name[100];
    int n;

    printf("Enter your name: ");
    fflush(stdout);
    if (scanf("%99s", name) != 1) {
        fprintf(stderr, "EOF\\n");
        return 1;
    }

    printf("Enter a number: ");
    fflush(stdout);
    if (scanf("%d", &n) != 1) {
        fprintf(stderr, "EOF\\n");
        return 1;
    }

    printf("Hello, %s!\\n", name);
    printf("Double is: %d\\n", n * 2);
    return 0;
}
`,
  },
  {
    id: "cpp",
    label: "C++",
    monaco: "cpp",
    fileName: "main.cpp",
    outputMode: "terminal",
    runner: "judge0",
    supportsStdin: true,
    defaultStdin: "",
    stdinHint: "cin — during Run, type in the terminal",
    badgeColor: "#f34b7d",
    sample: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int n;

    cout << "Enter your name: " << flush;
    if (!(cin >> name)) {
        cerr << "EOF" << endl;
        return 1;
    }

    cout << "Enter a number: " << flush;
    if (!(cin >> n)) {
        cerr << "EOF" << endl;
        return 1;
    }

    cout << "Hello, " << name << "!" << endl;
    cout << "Double is: " << (n * 2) << endl;
    return 0;
}
`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    fileName: "main.js",
    outputMode: "terminal",
    runner: "browser-js",
    supportsStdin: false,
    defaultStdin: "",
    stdinHint: "",
    badgeColor: "#f0db4f",
    sample: `// JavaScript — runs in the browser
console.log("Hello from JavaScript!");
console.log("Write your code and press Run");

let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum += i;
  console.log("i = " + i + ", sum = " + sum);
}

// You can also return a value:
// return "done";
`,
  },
  {
    id: "html",
    label: "HTML",
    monaco: "html",
    fileName: "index.html",
    outputMode: "preview",
    runner: "preview",
    supportsStdin: false,
    defaultStdin: "",
    stdinHint: "",
    badgeColor: "#e44d26",
    sample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #1e1f22, #2b2d30);
      color: #dfdfe0;
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .card {
      background: #2b2d30;
      border: 1px solid #393b40;
      border-radius: 12px;
      padding: 2rem 2.5rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,.35);
    }
    h1 { margin: 0 0 .5rem; color: #7aa2f7; }
    p { margin: 0; color: #bcbec4; }
    button {
      margin-top: 1.25rem;
      background: #3574f0;
      color: white;
      border: none;
      border-radius: 8px;
      padding: .6rem 1.2rem;
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover { background: #4b86f5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello HTML!</h1>
    <p>Edit this page and press Run to preview.</p>
    <button onclick="alert('It works!')">Click me</button>
  </div>
</body>
</html>
`,
  },
  {
    id: "css",
    label: "CSS",
    monaco: "css",
    fileName: "styles.css",
    outputMode: "preview",
    runner: "preview",
    supportsStdin: false,
    defaultStdin: "",
    stdinHint: "",
    badgeColor: "#264de4",
    sample: `/* CSS preview — styles a demo page */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}

.box {
  width: 280px;
  padding: 2rem;
  border-radius: 16px;
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid #334155;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.box:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 50px rgba(56, 189, 248, 0.15);
}

.box h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  background: linear-gradient(90deg, #38bdf8, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.box p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
}

.badge {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: #22c55e33;
  color: #4ade80;
  font-size: 0.8rem;
  font-weight: 600;
}
`,
  },
];

export function getLanguage(id: LangId): LanguageConfig {
  return LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
}

export function extractPublicClassName(code: string): string {
  const match = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
  if (match?.[1]) return match[1];

  const anyClass = code.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)/);
  if (anyClass?.[1]) return anyClass[1];

  return "Main";
}

export function fileNameFor(lang: LangId, code: string): string {
  if (lang === "java") {
    return `${extractPublicClassName(code)}.java`;
  }
  return getLanguage(lang).fileName;
}

/** Shell-style command shown in the terminal when running. */
export function runCommandFor(lang: LangId, code: string): string {
  const file = fileNameFor(lang, code);
  switch (lang) {
    case "java":
      return `> javac ${file} && java ${file.replace(/\.java$/, "")}`;
    case "python":
      return `> python ${file}`;
    case "c":
      return `> gcc ${file} -o main && ./main`;
    case "cpp":
      return `> g++ ${file} -o main && ./main`;
    case "javascript":
      return `> node ${file}`;
    default:
      return `> run ${file}`;
  }
}

export function usesWideTabs(lang: LangId): boolean {
  return lang === "java" || lang === "python" || lang === "c" || lang === "cpp";
}

/** Build a full HTML document for the preview pane. */
export function buildPreviewHtml(lang: LangId, code: string): string {
  if (lang === "html") {
    const trimmed = code.trim();
    if (/<!DOCTYPE/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
      return code;
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
</head>
<body>
${code}
</body>
</html>`;
  }

  if (lang === "css") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CSS Preview</title>
  <style>
${code}
  </style>
</head>
<body>
  <div class="box">
    <h1>CSS Preview</h1>
    <p>Your styles are applied to this demo card.</p>
    <span class="badge">Live preview</span>
  </div>
</body>
</html>`;
  }

  return "";
}
