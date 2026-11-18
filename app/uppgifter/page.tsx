"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  courseOptions,
  formatDeadline,
  statusLabels,
  type CourseName,
  type StudyTask,
  type TaskStatus,
} from "../lib/tasks";
import { useTasks } from "../lib/use-tasks";
import Link from "next/link";

type Filter = "all" | TaskStatus;

type TaskForm = {
  title: string;
  course: CourseName;
  deadline: string;
  status: TaskStatus;
  description: string;
};

const emptyForm: TaskForm = {
  title: "",
  course: courseOptions[0],
  deadline: "",
  status: "upcoming",
  description: "",
};

export default function TasksPage() {
  // Härifrån läser och sparar vi alla uppgifter i localStorage.
  const { tasks, setTasks } = useTasks();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return tasks
      .filter((task) => {
        return filter === "all" || task.status === filter;
      })
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

  function updateForm(field: keyof TaskForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "done"
                  ? "in-progress"
                  : "done",
            }
          : task,
      ),
    );
  }

  function openModal() {
    setForm(emptyForm);
    setFormError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormError("");
  }

  function getCourseTone(course: CourseName) {
    if (course.includes("LIA")) {
      return "mint";
    }

    if (course.includes("Examensarbetet")) {
      return "yellow";
    }

    return "lilac";
  }

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError("Skriv en titel på uppgiften.");
      return;
    }

    if (!form.description.trim()) {
      setFormError("Skriv en kort beskrivning.");
      return;
    }

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: form.title.trim(),
      course: form.course,
      deadline: form.deadline || null,
      status: form.status,
      description: form.description.trim(),
      tone: getCourseTone(form.course),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    closeModal();
  }

  const allCount = tasks.length;
  const activeCount = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;
  const upcomingCount = tasks.filter(
    (task) => task.status === "upcoming",
  ).length;
  const doneCount = tasks.filter(
    (task) => task.status === "done",
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#26364d]">
      <div className="mx-auto min-h-screen max-w-[1500px]">
        <header className="flex items-center justify-between border-b border-[#e6e9f1] bg-[#fffdf8] px-5 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-extrabold tracking-tight"
          >
            <span className="grid size-9 rotate-[-5deg] place-items-center rounded-xl rounded-bl-md bg-[#5d72ee] text-xl text-white">
              <span className="rotate-[5deg]">✦</span>
            </span>
            Studyflow
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="rounded-xl bg-[#5d72ee] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#5d72ee]/20"
              type="button"
              onClick={openModal}
            >
              + Ny uppgift
            </button>

            <Link
              href="/"
              className="hidden rounded-xl bg-[#e4e8ff] px-4 py-3 text-xs font-bold text-[#4052bc] sm:block"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <section className="p-5 sm:p-8 lg:p-12">
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
            <SummaryCard
              label="Totalt"
              value={allCount}
              color="bg-[#e7efff]"
            />

            <SummaryCard
              label="Pågående"
              value={activeCount}
              color="bg-[#c7ecd8]"
            />

            <SummaryCard
              label="Klara"
              value={doneCount}
              color="bg-[#ffe4de]"
            />
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

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-10 grid place-items-center bg-[#26364d]/30 p-5"
          role="presentation"
          onMouseDown={closeModal}
        >
          <section
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-task-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8591a5]">
                  Lägg till i Studyflow
                </p>

                <h2
                  id="new-task-title"
                  className="mt-1 text-2xl font-extrabold tracking-[-0.06em]"
                >
                  Ny uppgift
                </h2>
              </div>

              <button
                className="grid size-8 place-items-center rounded-xl border border-[#e6e9f1] text-xl text-[#8591a5]"
                type="button"
                onClick={closeModal}
                aria-label="Stäng formuläret"
              >
                ×
              </button>
            </div>

            <form className="grid gap-4" onSubmit={createTask}>
              <label className="grid gap-2 text-xs font-bold text-[#8591a5]">
                Titel
                <input
                  className="rounded-xl border border-[#e6e9f1] bg-[#f7f8fc] px-3 py-3 text-sm text-[#26364d] outline-none focus:border-[#5d72ee]"
                  value={form.title}
                  onChange={(event) =>
                    updateForm("title", event.target.value)
                  }
                  placeholder="Ex. Förbered presentation"
                  autoFocus
                />
              </label>

              <label className="grid gap-2 text-xs font-bold text-[#8591a5]">
                Kurs
                <select
                  className="rounded-xl border border-[#e6e9f1] bg-[#f7f8fc] px-3 py-3 text-sm text-[#26364d] outline-none focus:border-[#5d72ee]"
                  value={form.course}
                  onChange={(event) =>
                    updateForm("course", event.target.value)
                  }
                >
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-bold text-[#8591a5]">
                  Deadline
                  <input
                    className="rounded-xl border border-[#e6e9f1] bg-[#f7f8fc] px-3 py-3 text-sm text-[#26364d] outline-none focus:border-[#5d72ee]"
                    type="datetime-local"
                    value={form.deadline}
                    onChange={(event) =>
                      updateForm("deadline", event.target.value)
                    }
                  />
                </label>

                <label className="grid gap-2 text-xs font-bold text-[#8591a5]">
                  Status
                  <select
                    className="rounded-xl border border-[#e6e9f1] bg-[#f7f8fc] px-3 py-3 text-sm text-[#26364d] outline-none focus:border-[#5d72ee]"
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                  >
                    <option value="upcoming">Inte påbörjad</option>
                    <option value="in-progress">Pågående</option>
                    <option value="done">Klar</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-xs font-bold text-[#8591a5]">
                Beskrivning
                <textarea
                  className="min-h-24 resize-y rounded-xl border border-[#e6e9f1] bg-[#f7f8fc] px-3 py-3 text-sm text-[#26364d] outline-none focus:border-[#5d72ee]"
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Vad behöver göras?"
                />
              </label>

              {formError ? (
                <p className="text-xs font-bold text-[#aa5042]" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="flex justify-end gap-3">
                <button
                  className="rounded-xl border border-[#e6e9f1] px-4 py-3 text-xs font-bold text-[#8591a5]"
                  type="button"
                  onClick={closeModal}
                >
                  Avbryt
                </button>

                <button
                  className="rounded-xl bg-[#5d72ee] px-4 py-3 text-xs font-bold text-white"
                  type="submit"
                >
                  Spara uppgift
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
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
            className={`text-sm font-extrabold ${
              isDone ? "line-through" : ""
            }`}
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
