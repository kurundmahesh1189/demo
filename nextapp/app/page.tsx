"use client";

import { useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";

type Property = { title: string; description: string };
type Result = { domain: string; category: string; properties: Property[] };

function extractDomain(text: string): string | null {
  const match = text.match(/3p\s+(.+)/i);
  return match ? match[1].trim() : null;
}

export default function Home() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function run3P() {
    const domain = extractDomain(input);
    if (!domain) {
      setError("⚠️ Use format: 3P something");
      return;
    }
    setError("");
    setResult(null);
    setStreaming(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setError(err.error ?? "Generation failed");
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Check for error sentinel
        if (buffer.includes("__ERROR__:")) {
          const msg = buffer.split("__ERROR__:")[1];
          setError(msg.trim() || "Generation failed");
          setStreaming(false);
          return;
        }

        // Try parse partial JSON as it streams in
        try {
          const parsed: Result = JSON.parse(buffer);
          setResult(parsed);
        } catch {
          // Not complete JSON yet — keep buffering
        }
      }

      // Final parse on complete buffer
      try {
        const parsed: Result = JSON.parse(buffer);
        setResult(parsed);
      } catch {
        setError("Failed to parse AI response. Try again.");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Connection error. Please try again.");
      }
    } finally {
      setStreaming(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="w-[480px] bg-[rgba(30,41,59,0.95)] p-8 rounded-2xl shadow-2xl backdrop-blur">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-100">✨ 3P Generator</h1>
          <div className="flex items-center gap-3">
            <a href="/progress" className="text-xs text-slate-400 hover:text-sky-400 transition-colors">Progress</a>
            {session?.user ? (
              <a href="/profile" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
                {session.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                )}
                {session.user.name?.split(" ")[0]}
              </a>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="text-xs px-3 py-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-900 text-base outline-none"
            placeholder="3P cars, 3P Kohli, 3P Python..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !streaming && run3P()}
            disabled={streaming}
          />
          <button
            onClick={streaming ? () => abortRef.current?.abort() : run3P}
            className={`px-4 py-3 rounded-xl font-bold transition-colors ${
              streaming
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-sky-400 text-slate-900 hover:bg-sky-500"
            }`}
          >
            {streaming ? "Stop" : "Go"}
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-2">
          {streaming ? (
            <span className="animate-pulse text-sky-400">AI is thinking...</span>
          ) : (
            "Type: 3P <domain>"
          )}
        </p>

        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

        {!session?.user && (
          <p className="mt-2 text-xs text-slate-500 text-center">
            <button onClick={() => signIn("google")} className="text-sky-400 hover:underline">Sign in</button> to save generations.
          </p>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-100">3P ({result.domain})</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-400 capitalize">{result.category}</span>
            </div>
            {result.properties.map((p, i) => (
              <div
                key={i}
                className="bg-slate-700 hover:bg-slate-600 transition-all hover:scale-[1.02] rounded-xl p-4 mb-3"
              >
                <h3 className="font-semibold text-slate-100 mb-1">{p.title}</h3>
                <p className="text-slate-300 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Streaming skeleton */}
        {streaming && !result && (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700/50 rounded-xl p-4 animate-pulse">
                <div className="h-4 w-24 bg-slate-600 rounded mb-2" />
                <div className="h-3 w-full bg-slate-600/60 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
