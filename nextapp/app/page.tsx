"use client";

import { useState } from "react";

type Category = "person" | "product" | "technology" | "place" | "general";
type Feature = [string, string];

function extractDomain(text: string): string | null {
  const match = text.match(/3p\s+(.+)/i);
  return match ? match[1].trim() : null;
}

function classify(domain: string): Category {
  const d = domain.toLowerCase();
  if (d.includes("kohli") || d.includes("ronaldo") || d.includes("federer")) return "person";
  if (d.includes("car") || d.includes("tesla") || d.includes("ford")) return "product";
  if (d.includes("python") || d.includes("ai") || d.includes("tech")) return "technology";
  if (d.includes("city") || d.includes("hyderabad") || d.includes("india")) return "place";
  return "general";
}

function generate(domain: string, type: Category): Feature[] {
  switch (type) {
    case "person":
      return [
        ["Consistency", `${domain} performs at a high level consistently.`],
        ["Discipline", `Strong work ethic and dedication.`],
        ["Influence", `Impacts fans and industry significantly.`],
      ];
    case "product":
      return [
        ["Performance", `${domain} delivers strong functionality.`],
        ["Design", `Focus on usability and aesthetics.`],
        ["Innovation", `Includes modern features and improvements.`],
      ];
    case "technology":
      return [
        ["Scalability", `${domain} can handle growth efficiently.`],
        ["Ecosystem", `Backed by tools and community.`],
        ["Flexibility", `Used across multiple applications.`],
      ];
    case "place":
      return [
        ["Culture", `${domain} has rich traditions and history.`],
        ["Economy", `Contributes to business and jobs.`],
        ["Lifestyle", `Offers unique living experiences.`],
      ];
    default:
      return [
        ["Core Feature", `${domain} has defining characteristics.`],
        ["Use Case", `Widely used or recognized.`],
        ["Value", `Provides practical benefits.`],
      ];
  }
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ domain: string; features: Feature[] } | null>(null);
  const [error, setError] = useState("");

  function run3P() {
    const domain = extractDomain(input);
    if (!domain) {
      setError("⚠️ Use format: 3P something");
      setResult(null);
      return;
    }
    setError("");
    const type = classify(domain);
    setResult({ domain, features: generate(domain, type) });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="w-[450px] bg-[rgba(30,41,59,0.95)] p-8 rounded-2xl shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-bold text-center text-slate-100 mb-6">✨ 3P Generator</h1>

        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-900 text-base outline-none"
            placeholder="Enter any domain... (e.g. 3P cars, 3P Kohli)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run3P()}
          />
          <button
            onClick={run3P}
            className="px-4 py-3 rounded-xl bg-sky-400 text-slate-900 font-bold hover:bg-sky-500 transition-colors"
          >
            Go
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-2">Type: 3P &lt;domain&gt;</p>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">3P ({result.domain})</h2>
            {result.features.map(([title, desc]) => (
              <div
                key={title}
                className="bg-slate-700 hover:bg-slate-600 transition-all hover:scale-[1.02] rounded-xl p-4 mb-3"
              >
                <h3 className="font-semibold text-slate-100 mb-1">{title}</h3>
                <p className="text-slate-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
