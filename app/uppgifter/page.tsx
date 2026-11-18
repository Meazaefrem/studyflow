"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import {
  formatDeadline,
  statusLabels,
  type StudyTask,
  type TaskStatus,
} from "../lib/tasks";
import { useTasks } from "../lib/use-tasks";

type Filter = "all" | TaskStatus;

export default function TasksPage() {
  // Alla ändringar sparas i localStorage genom useTasks.
  const { tasks, setTasks } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return tasks
      .filter((task) => filter === "all" || task.status === filter)
      .filter((task) => {
        if (!searchText) {
          return true;
        }

        return `${task.title} ${task.course} ${task.description}`
          .toLowerCase()
          .includes(searchText);
      })
      .sort((first, second) => {
        if (!first.deadline) return 1;
        if (!second.deadline) return -1;
        return first.deadline.localeCompare(second.deadline);
      });
  }, [filter, search, tasks]);

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "done" ? "in-progress" : "done",
            }
          : task,
      ),
    );
  }

  const allCount = tasks.length;
  const activeCount = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const upcomingCount = tasks.filter(
    (task) => task.status === "upcoming",
  ).length;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#26364d]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <Sidebar />

        <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-12">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8591a5]">
                Din plan
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">
                Alla uppgifter
              </h1>
              <p className="mt-2 text-sm text-[#8591a5]">
                Håll koll på vad som ska göras och markera varje liten vinst.
              </p>
            </div>

            <div className="rotate-3 rounded-xl bg-[#ffdc7a] px-4 py-3 text-xs font-extrabold text-[#805e18]">
              Du klarar det! ✦
            </div>
          </div>

          <section className="mb-5 grid gap-4 sm:grid-cols-3">
            <SummaryCard label="Totalt" value={allCount} color="bg-[#e7efff]" />
            <SummaryCard
              label="Pågående"
              value={activeCount}
              color="bg-[#c7ecd8]"
            />
            <SummaryCard label="Klara" value={doneCount} color="bg-[#ffe4de]" />
          </section>

          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            {/* Filterknapparna visar bara de uppgifter som passar valet. */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filtrera uppgifter"
            >
              <FilterButton
                label={`Alla · ${allCount}`}
                active={filter === "all"}
                onClick={() => setFilter("all")}
              />
              <FilterButton
                label={`Pågående · ${activeCount}`}
                active={filter === "in-progress"}
                onClick={() => setFilter("in-progress")}
              />
              <FilterButton
                label={`Kommande · ${upcomingCount}`}
                active={filter === "upcoming"}
                onClick={() => setFilter("upcoming")}
              />
              <FilterButton
                label={`Klara · ${doneCount}`}
                active={filter === "done"}
                onClick={() => setFilter("done")}
              />
            </div>

            <label className="flex min-w-57.5 items-center gap-2 rounded-xl border border-[#e6e9f1] bg-white px-3 py-2 text-sm text-[#8591a5]">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Sök uppgift</span>
              <input
                className="w-full border-0 bg-transparent text-xs text-[#26364d] outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Sök uppgift"
              />
            </label>
          </div>

          <section className="grid gap-3" aria-live="polite">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#cbd3e2] bg-white p-10 text-center text-sm text-[#8591a5]">
                Inga uppgifter matchar ditt filter.
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <p className="text-xs font-bold text-[#72817a]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-[-0.07em]">
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
        active
          ? "border-transparent bg-[#e4e8ff] text-[#4052bc]"
          : "border-[#e6e9f1] bg-white text-[#8591a5] hover:bg-[#f1f3fb]"
      }`}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function TaskCard({
  task,
  onToggle,
}: {
  task: StudyTask;
  onToggle: () => void;
}) {
  const isDone = task.status === "done";

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border border-[#e6e9f1] bg-white p-5 transition sm:flex-row sm:items-center ${
        isDone ? "opacity-60" : ""
      }`}
    >
      <button
        className={`grid size-6 shrink-0 place-items-center rounded-lg border text-sm font-bold text-white ${
          isDone
            ? "border-[#5d72ee] bg-[#5d72ee]"
            : "border-[#cbd3e2] bg-white"
        }`}
        type="button"
        aria-pressed={isDone}
        aria-label={
          isDone
            ? `Markera ${task.title} som pågående`
            : `Markera ${task.title} som klar`
        }
        onClick={onToggle}
      >
        {isDone ? "✓" : ""}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className={`text-sm font-extrabold ${isDone ? "line-through" : ""}`}
          >
            {task.title}
          </h2>

          <span
            className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
              task.tone === "mint"
                ? "bg-[#c7ecd8] text-[#3c7757]"
                : task.tone === "yellow"
                  ? "bg-[#fff3cb] text-[#86641d]"
                  : "bg-[#ded8ff] text-[#6257a6]"
            }`}
          >
            {task.course.replace("JSU25S - ", "")}
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[#8591a5]">
          {task.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
        <span
          className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
            task.status === "done"
              ? "bg-[#c7ecd8] text-[#3c7757]"
              : task.status === "in-progress"
                ? "bg-[#e4e8ff] text-[#4052bc]"
                : "bg-[#fff3cb] text-[#86641d]"
          }`}
        >
          {statusLabels[task.status]}
        </span>

        <span className="text-xs text-[#8591a5]">
          {formatDeadline(task.deadline)}
        </span>
      </div>
    </article>
  );
}
