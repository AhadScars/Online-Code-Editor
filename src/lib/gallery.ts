import type { LangId } from "@/lib/languages";

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: "basics" | "algorithms" | "web" | "data";
  langId: LangId;
  code: string;
  stdin?: string;
};

export const GALLERY_CATEGORIES: {
  id: GalleryItem["category"];
  label: string;
}[] = [
  { id: "basics", label: "Basics" },
  { id: "algorithms", label: "Algorithms" },
  { id: "web", label: "Web" },
  { id: "data", label: "Data" },
];

export const GALLERY: GalleryItem[] = [
  {
    id: "py-hello",
    title: "Python Hello + Input",
    description: "Read name and number, print a greeting.",
    category: "basics",
    langId: "python",
    code: `name = input("Name: ")
n = int(input("Number: "))
print(f"Hi {name}, double is {n * 2}")
`,
  },
  {
    id: "java-loop",
    title: "Java For Loop",
    description: "Print numbers 1–10 with a for loop.",
    category: "basics",
    langId: "java",
    code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}
`,
  },
  {
    id: "go-fizzbuzz",
    title: "Go FizzBuzz",
    description: "Classic FizzBuzz 1–20 in Go.",
    category: "basics",
    langId: "go",
    code: `package main

import "fmt"

func main() {
	for i := 1; i <= 20; i++ {
		switch {
		case i%15 == 0:
			fmt.Println("FizzBuzz")
		case i%3 == 0:
			fmt.Println("Fizz")
		case i%5 == 0:
			fmt.Println("Buzz")
		default:
			fmt.Println(i)
		}
	}
}
`,
  },
  {
    id: "ts-types",
    title: "TypeScript Types",
    description: "Interfaces and typed functions.",
    category: "basics",
    langId: "typescript",
    code: `interface User {
  name: string;
  age: number;
}

function introduce(u: User): string {
  return \`\${u.name} is \${u.age} years old\`;
}

const user: User = { name: "Ada", age: 36 };
console.log(introduce(user));
`,
  },
  {
    id: "rust-fib",
    title: "Rust Fibonacci",
    description: "Print the first 12 Fibonacci numbers.",
    category: "algorithms",
    langId: "rust",
    code: `fn main() {
    let mut a: u64 = 0;
    let mut b: u64 = 1;
    for _ in 0..12 {
        println!("{}", a);
        let next = a + b;
        a = b;
        b = next;
    }
}
`,
  },
  {
    id: "kt-factorial",
    title: "Kotlin Factorial",
    description: "Recursive factorial for n = 6.",
    category: "algorithms",
    langId: "kotlin",
    code: `fun factorial(n: Int): Long =
    if (n <= 1) 1 else n * factorial(n - 1)

fun main() {
    val n = 6
    println("factorial($n) = \${factorial(n)}")
}
`,
  },
  {
    id: "cpp-binary-search",
    title: "C++ Binary Search",
    description: "Search for a target in a sorted array.",
    category: "algorithms",
    langId: "cpp",
    code: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& a, int target) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> a = {1, 3, 5, 7, 9, 11};
    cout << binarySearch(a, 7) << endl;   // 3
    cout << binarySearch(a, 4) << endl;   // -1
    return 0;
}
`,
  },
  {
    id: "py-bubble",
    title: "Python Bubble Sort",
    description: "Sort a list in ascending order.",
    category: "algorithms",
    langId: "python",
    code: `def bubble_sort(arr):
    a = list(arr)
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

nums = [5, 1, 4, 2, 8]
print(bubble_sort(nums))
`,
  },
  {
    id: "html-card",
    title: "HTML Profile Card",
    description: "A simple styled profile card page.",
    category: "web",
    langId: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Profile Card</title>
  <style>
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0;
    }
    .card {
      width: 280px; padding: 1.5rem; border-radius: 16px;
      background: #1e293b; border: 1px solid #334155; text-align: center;
    }
    .avatar {
      width: 72px; height: 72px; margin: 0 auto 1rem; border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #a78bfa);
    }
    h1 { margin: 0 0 .25rem; font-size: 1.25rem; }
    p { margin: 0; color: #94a3b8; font-size: .9rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar"></div>
    <h1>Alex Dev</h1>
    <p>Frontend · Open source</p>
  </div>
</body>
</html>
`,
  },
  {
    id: "css-button",
    title: "CSS Fancy Button",
    description: "Hover effects on a demo button.",
    category: "web",
    langId: "css",
    code: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #111827;
  font-family: system-ui, sans-serif;
}

.box {
  text-align: center;
  color: #e5e7eb;
}

.box h1 { font-size: 1.25rem; margin-bottom: 1rem; }

.badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.badge:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 28px rgba(139, 92, 246, 0.45);
}
`,
  },
  {
    id: "js-array",
    title: "JS Array Methods",
    description: "map, filter, reduce demo in the browser.",
    category: "basics",
    langId: "javascript",
    code: `const nums = [1, 2, 3, 4, 5, 6];

const doubled = nums.map((n) => n * 2);
const evens = nums.filter((n) => n % 2 === 0);
const sum = nums.reduce((a, b) => a + b, 0);

console.log("doubled:", doubled);
console.log("evens:", evens);
console.log("sum:", sum);
`,
  },
  {
    id: "sql-join",
    title: "SQL JOIN",
    description: "Join students with grades.",
    category: "data",
    langId: "sql",
    code: `CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE grades (
  student_id INTEGER,
  course TEXT,
  score INTEGER
);

INSERT INTO students VALUES (1, 'Ada'), (2, 'Grace'), (3, 'Alan');
INSERT INTO grades VALUES
  (1, 'Math', 95),
  (1, 'CS', 98),
  (2, 'Math', 90),
  (3, 'CS', 88);

SELECT s.name, g.course, g.score
FROM students s
JOIN grades g ON g.student_id = s.id
ORDER BY g.score DESC;
`,
  },
  {
    id: "php-hello",
    title: "PHP Hello",
    description: "Simple PHP script with string and loop.",
    category: "basics",
    langId: "php",
    code: `<?php
echo "Hello from PHP!\\n";
for ($i = 1; $i <= 5; $i++) {
    echo "Count: $i\\n";
}
`,
  },
  {
    id: "rb-hash",
    title: "Ruby Hash",
    description: "Work with a hash of scores.",
    category: "basics",
    langId: "ruby",
    code: `scores = { "Ada" => 95, "Grace" => 88, "Alan" => 91 }

scores.each do |name, score|
  puts "#{name}: #{score}"
end

avg = scores.values.sum.to_f / scores.size
puts "Average: #{avg.round(1)}"
`,
  },
  {
    id: "cs-linq-style",
    title: "C# LINQ-style",
    description: "Filter and project a list of numbers.",
    category: "basics",
    langId: "csharp",
    code: `using System;
using System.Linq;

public class Program {
    public static void Main() {
        int[] nums = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        var result = nums
            .Where(n => n % 2 == 0)
            .Select(n => n * n);

        foreach (var x in result) {
            Console.WriteLine(x);
        }
    }
}
`,
  },
];

export function getGalleryItem(id: string): GalleryItem | undefined {
  return GALLERY.find((g) => g.id === id);
}
