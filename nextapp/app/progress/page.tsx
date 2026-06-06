"use client";

import { useEffect, useState, useCallback } from "react";
import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

type Status = "todo" | "in_progress" | "done";

interface Task {
  id: number;
  parent_id: number | null;
  title: string;
  phase: number;
  status: Status;
  week: number;
  sort_order: number;
}

const STATUS_COLORS: Record<Status, string> = {
  done: "#22c55e",
  in_progress: "#f59e0b",
  todo: "#64748b",
};

const PHASE_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

const STATUS_CYCLE: Status[] = ["todo", "in_progress", "done"];

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/progress");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function cycleStatus(task: Task) {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(task.status) + 1) % 3];
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: next } : t));
    await fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: next }),
    });
  }

  const phases = tasks.filter((t) => t.parent_id === null);
  const childTasks = tasks.filter((t) => t.parent_id !== null);

  const totalTasks = childTasks.length;
  const doneTasks = childTasks.filter((t) => t.status === "done").length;
  const inProgressTasks = childTasks.filter((t) => t.status === "in_progress").length;
  const todoTasks = childTasks.filter((t) => t.status === "todo").length;
  const overallPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Per-phase stats for bar chart
  const phaseStats = phases.map((p) => {
    const kids = childTasks.filter((t) => t.parent_id === p.id);
    const done = kids.filter((t) => t.status === "done").length;
    const inProg = kids.filter((t) => t.status === "in_progress").length;
    const todo = kids.filter((t) => t.status === "todo").length;
    return {
      name: `P${p.phase}`,
      fullName: p.title.replace(/Phase \d+ — /, ""),
      done,
      in_progress: inProg,
      todo,
      total: kids.length,
      pct: kids.length ? Math.round((done / kids.length) * 100) : 0,
    };
  });

  // Pie data
  const pieData = [
    { name: "Done", value: doneTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Todo", value: todoTasks },
  ].filter((d) => d.value > 0);

  // Cumulative progress line (by phase order)
  const cumulativeLine = phaseStats.reduce<{ phase: string; cumulative: number }[]>((acc, p, i) => {
    const prev = acc[i - 1]?.cumulative ?? 0;
    acc.push({ phase: p.name, cumulative: prev + p.done });
    return acc;
  }, []);

  // Radial data (overall)
  const radialData = [{ name: "Progress", value: overallPct, fill: "#6366f1" }];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-slate-400 text-lg animate-pulse">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Build Progress</h1>
          <p className="text-slate-400 mt-1">YC App — 8 Phase Roadmap</p>
        </div>
        <a href="/" className="text-sky-400 hover:text-sky-300 text-sm">← Back to App</a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tasks", value: totalTasks, color: "text-slate-100" },
          { label: "Completed", value: doneTasks, color: "text-green-400" },
          { label: "In Progress", value: inProgressTasks, color: "text-amber-400" },
          { label: "Remaining", value: todoTasks, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">{label}</p>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Radial overall */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 flex flex-col items-center">
          <h2 className="text-slate-300 font-semibold mb-4 self-start">Overall Completion</h2>
          <div className="relative">
            <RadialBarChart width={200} height={200} innerRadius={60} outerRadius={90} data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#1e293b" }} />
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{overallPct}%</span>
              <span className="text-slate-400 text-xs">complete</span>
            </div>
          </div>
          <div className="mt-2 text-slate-400 text-sm">{doneTasks} of {totalTasks} tasks done</div>
        </div>

        {/* Pie status breakdown */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-slate-300 font-semibold mb-4">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase().replace(" ", "_") as Status] ?? "#64748b"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Legend formatter={(v) => <span className="text-slate-300 text-sm">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative done line */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-slate-300 font-semibold mb-4">Cumulative Done (by Phase)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={cumulativeLine}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="phase" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Line type="monotone" dataKey="cumulative" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stacked bar per phase */}
      <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 mb-6">
        <h2 className="text-slate-300 font-semibold mb-4">Tasks per Phase</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={phaseStats} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              formatter={(value, name) => [value, name === "in_progress" ? "In Progress" : name ? name.toString().charAt(0).toUpperCase() + name.toString().slice(1) : name]}
            />
            <Legend formatter={(v) => <span className="text-slate-300 text-sm">{v === "in_progress" ? "In Progress" : v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
            <Bar dataKey="done" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="in_progress" stackId="a" fill="#f59e0b" />
            <Bar dataKey="todo" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Phase completion % bar */}
      <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 mb-8">
        <h2 className="text-slate-300 font-semibold mb-4">Phase Completion %</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={phaseStats} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={30} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              formatter={(v) => [`${v}%`, "Complete"]}
            />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} label={{ position: "insideRight", fill: "#fff", fontSize: 11, formatter: (v: number) => v > 0 ? `${v}%` : "" }}>
              {phaseStats.map((_, i) => (
                <Cell key={i} fill={PHASE_COLORS[i % PHASE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task checklist by phase */}
      <div className="space-y-4">
        <h2 className="text-slate-300 font-semibold text-lg">Task Checklist</h2>
        {phases.map((phase, pi) => {
          const kids = childTasks.filter((t) => t.parent_id === phase.id);
          const done = kids.filter((t) => t.status === "done").length;
          const pct = kids.length ? Math.round((done / kids.length) * 100) : 0;
          return (
            <div key={phase.id} className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
              {/* Phase header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: PHASE_COLORS[pi % PHASE_COLORS.length] }}>
                    {phase.phase}
                  </span>
                  <span className="font-semibold text-slate-100">{phase.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">{done}/{kids.length}</span>
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PHASE_COLORS[pi % PHASE_COLORS.length] }} />
                  </div>
                  <span className="text-slate-300 text-sm font-medium w-10 text-right">{pct}%</span>
                </div>
              </div>
              {/* Tasks */}
              <div className="divide-y divide-slate-700/50">
                {kids.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-700/30 transition-colors">
                    <button
                      onClick={() => cycleStatus(task)}
                      title="Click to cycle status"
                      className="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: STATUS_COLORS[task.status],
                        background: task.status === "done" ? STATUS_COLORS.done : task.status === "in_progress" ? STATUS_COLORS.in_progress + "33" : "transparent",
                      }}
                    >
                      {task.status === "done" && <span className="text-white text-xs">✓</span>}
                      {task.status === "in_progress" && <span className="text-amber-400 text-xs">●</span>}
                    </button>
                    <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-slate-500" : "text-slate-200"}`}>
                      {task.title}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: STATUS_COLORS[task.status] + "22", color: STATUS_COLORS[task.status] }}
                    >
                      {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
