"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TaskModal } from "./TaskModal";

export function Sidebar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDashboard = pathname === "/";
  const isTasksPage = pathname === "/uppgifter";

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#e6e9f1] bg-[#fffdf8] p-4 lg:w-[220px] lg:border-b-0 lg:border-r lg:p-6">
      <Link
        href="/"
        className="flex items-center gap-3 text-lg font-extrabold tracking-tight"
      >
        <span className="grid size-9 rotate-[-5deg] place-items-center rounded-xl rounded-bl-md bg-[#5d72ee] text-xl text-white">
          <span className="rotate-[5deg]">✦</span>
        </span>
        Studyflow
      </Link>

      <nav
        className="mt-4 flex gap-2 overflow-x-auto lg:mt-10 lg:block lg:space-y-2"
        aria-label="Huvudnavigation"
      >
        <Link
          href="/"
          className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition hover:bg-[#e4e8ff] ${
            isDashboard
              ? "bg-[#e4e8ff] text-[#4052bc]"
              : "text-[#8591a5]"
          }`}
        >
          <span>⌂</span>
          Översikt
        </Link>

        <Link
          href="/uppgifter"
          className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-bold transition hover:bg-[#e4e8ff] ${
            isTasksPage
              ? "bg-[#e4e8ff] text-[#4052bc]"
              : "text-[#8591a5]"
          }`}
        >
          <span>✓</span>
          Uppgifter
        </Link>

        <button
          className="flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm text-[#b2bac8]"
          type="button"
          disabled
          title="Kalender kommer senare"
        >
          <span>▦</span>
          Kalender
        </button>

        <button
          className="flex min-h-11 shrink-0 items-center gap-3 rounded-xl bg-[#5d72ee] px-3 text-left text-sm font-bold text-white shadow-lg shadow-[#5d72ee]/20 transition hover:bg-[#4c60d0]"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          <span>+</span>
          Ny uppgift
        </button>
      </nav>

      <div className="mt-6 hidden rounded-2xl bg-[#fff3cb] p-4 text-xs leading-relaxed text-[#84621c] lg:mt-auto lg:block">
        <strong className="mb-1 block text-sm text-[#26364d]">
          Veckans lilla mål
        </strong>
        Börja med din CI/CD-uppgift och ta ett steg i taget.
      </div>

      {isModalOpen ? (
        <TaskModal onClose={() => setIsModalOpen(false)} />
      ) : null}
    </aside>
  );
}
