"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import {
  courseOptions,
  type CourseName,
  type CourseTone,
  type StudyTask,
  type TaskStatus,
} from "../lib/tasks";
import { useTasks } from "../lib/use-tasks";

type TaskModalProps = {
  onClose: () => void;
};

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

export function TaskModal({ onClose }: TaskModalProps) {
  const { setTasks } = useTasks();
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [formError, setFormError] = useState("");

  function updateForm(field: keyof TaskForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function getCourseTone(course: CourseName): CourseTone {
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
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-[#26364d]/30 p-5"
      role="presentation"
      onMouseDown={onClose}
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
            onClick={onClose}
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
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Ex. Förbered presentation"
              autoFocus
            />
          </label>

          <label className="grid gap-2 text-xs font-bold text-[#8591a5]">
            Kurs
            <select
              className="rounded-xl border border-[#e6e9f1] bg-[#f7f8fc] px-3 py-3 text-sm text-[#26364d] outline-none focus:border-[#5d72ee]"
              value={form.course}
              onChange={(event) => updateForm("course", event.target.value)}
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
                onChange={(event) => updateForm("status", event.target.value)}
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
              onClick={onClose}
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
  );
}
