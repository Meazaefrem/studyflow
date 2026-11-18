"use client";

import {
  formatDeadline,
  statusLabels,
} from "./lib/tasks";
import { useTasks } from "./lib/use-tasks";

export default function Home() {
  // Dashboarden använder samma lista som uppgiftssidan.
  const { tasks, setTasks } = useTasks();
  const assignment = tasks[0];

  if (!assignment) {
    return <p>Ingen uppgift hittades.</p>;
  }

  const isCompleted = assignment.status === "done";

  // Knappen på dashboarden växlar uppgiften mellan klar och inte klar.
  function toggleAssignment() {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === assignment.id
          ? {
              ...task,
              status: isCompleted ? "upcoming" : "done",
            }
          : task,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#26364d]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <aside className="hidden w-[220px] flex-col border-r border-[#e6e9f1] bg-[#fffdf8] p-6 lg:flex">
          <div className="flex items-center gap-3 text-lg font-extrabold tracking-tight">
            <div className="grid size-9 rotate-[-5deg] place-items-center rounded-xl rounded-bl-md bg-[#5d72ee] text-xl text-white">
              <span className="rotate-[5deg]">✦</span>
            </div>
            Studyflow
          </div>

          <nav className="mt-10 space-y-2" aria-label="Huvudnavigation">
            <button
              className="flex min-h-11 w-full items-center gap-3 rounded-xl bg-[#e4e8ff] px-3 text-left text-sm font-bold text-[#4052bc]"
              type="button"
            >
              <span>⌂</span>
              Översikt
            </button>

            <button
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-[#8591a5]"
              type="button"
              disabled
            >
              <span>✓</span>
              Uppgifter
            </button>

            <button
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-[#8591a5]"
              type="button"
              disabled
            >
              <span>▦</span>
              Kalender
            </button>
          </nav>

          <div className="mt-auto rounded-2xl bg-[#fff3cb] p-4 text-xs leading-relaxed text-[#84621c]">
            <strong className="mb-1 block text-sm text-[#26364d]">
              Veckans lilla mål
            </strong>
            Börja med din CI/CD-uppgift och ta ett steg i taget.
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-12">
          <header className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8591a5]">
                Din studieyta
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">
                Hej, Meaza!
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="rounded-xl bg-[#5d72ee] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#5d72ee]/20"
                type="button"
              >
                + Ny uppgift
              </button>

              <div
                className="grid size-10 place-items-center rounded-full bg-[#ffe4de] text-xs font-extrabold text-[#b25648]"
                aria-label="Meaza"
              >
                MA
              </div>
            </div>
          </header>

          {/* En enkel introduktion till veckans plan. */}
          <section className="relative mb-5 overflow-hidden rounded-[24px] bg-[#e7efff] p-6 sm:p-8">
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8591a5]">
                Din vecka i korthet
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.06em] sm:text-4xl">
                Planera lugnt.
                <br />
                Få saker gjorda.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#61708b]">
                Här ser du din viktigaste uppgift och hur långt du har kommit.
              </p>
            </div>

            <div className="absolute right-8 top-[-45px] grid size-40 place-items-center rounded-full bg-[#ded8ff]/70 text-4xl text-[#5d72ee]">
              ✦
            </div>
          </section>

          {/* Snabb överblick över uppgiftens status. */}
          <section className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#c7ecd8] p-5">
              <p className="text-xs font-bold text-[#72817a]">Pågående</p>
              <p className="mt-2 text-3xl font-extrabold tracking-[-0.07em]">
                {isCompleted ? 0 : 1}
              </p>
              <p className="mt-1 text-xs text-[#26364d]/60">
                uppgift att fokusera på
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff3cb] p-5">
              <p className="text-xs font-bold text-[#72817a]">
                Klart denna vecka
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-[-0.07em]">
                {isCompleted ? 1 : 0}
              </p>
              <p className="mt-1 text-xs text-[#26364d]/60">
                uppgift färdig
              </p>
            </div>

            <div className="rounded-2xl bg-[#ffe4de] p-5">
              <p className="text-xs font-bold text-[#72817a]">
                Nästa deadline
              </p>
              <p className="mt-2 text-2xl font-extrabold tracking-[-0.07em]">
                {formatDeadline(assignment.deadline)}
              </p>
              <p className="mt-1 text-xs text-[#26364d]/60">
                CI/CD-uppgiften
              </p>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-2xl border border-[#e6e9f1] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8591a5]">
                    Vecka 46 · november 2026
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold tracking-tight">
                    Veckokalender
                  </h2>
                </div>

                <span className="text-xs font-bold text-[#4c60d0]">
                  Denna vecka
                </span>
              </div>

              <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-[#e6e9f1]">
                {[
                  ["Mån", "09", "Projekt"],
                  ["Tis", "10", "Läsning"],
                  ["Ons", "11", ""],
                  ["Tor", "12", "Planera"],
                  ["Fre", "13", "Bygg"],
                  ["Lör", "14", "Deadline"],
                  ["Sön", "15", ""],
                ].map(([day, date, event], index) => (
                  <div
                    className="min-h-28 border-r border-[#e6e9f1] bg-white p-2 last:border-r-0"
                    key={day}
                  >
                    <p className="text-[10px] font-bold uppercase text-[#8591a5]">
                      {day}
                    </p>

                    <p
                      className={`mt-2 grid size-7 place-items-center text-sm font-extrabold ${
                        index === 5
                          ? "rounded-lg bg-[#5d72ee] text-white"
                          : ""
                      }`}
                    >
                      {date}
                    </p>

                    {event ? (
                      <div
                        className={`mt-3 rounded-lg p-1.5 text-[9px] leading-tight ${
                          index === 5
                            ? "bg-[#ffe4de] text-[#a35346]"
                            : index === 1
                              ? "bg-[#ded8ff] text-[#6257a6]"
                              : "bg-[#c7ecd8] text-[#3c7757]"
                        }`}
                      >
                        {event}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e6e9f1] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Kom ihåg
                </h2>
                <span className="text-xl text-[#e8b866]">☀</span>
              </div>

              <div className="rounded-xl bg-[#ffe4de] p-4 text-sm leading-relaxed text-[#824739]">
                <strong className="mb-1 block text-[#26364d]">
                  Du har en viktig uppgift
                </strong>
                Deadline är {formatDeadline(assignment.deadline)}. Börja tidigt
                så blir arbetet lugnare.
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-[#8591a5]">
                  <span>Din progress</span>
                  <strong className="text-[#26364d]">
                    {isCompleted ? "100%" : "0%"}
                  </strong>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#e4e8ff]">
                  <span
                    className="block h-full rounded-full bg-[#5d72ee] transition-all"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-2xl border border-[#e6e9f1] bg-white p-5">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8591a5]">
                Prioritera nästa
              </p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight">
                Din tillgängliga uppgift
              </h2>
            </div>

            <article className="flex flex-col gap-4 rounded-2xl border border-[#e6e9f1] p-4 sm:flex-row sm:items-center">
              <button
                className={`grid size-6 shrink-0 place-items-center rounded-lg border text-sm font-bold text-white ${
                  isCompleted
                    ? "border-[#5d72ee] bg-[#5d72ee]"
                    : "border-[#cbd3e2] bg-white"
                }`}
                type="button"
                aria-pressed={isCompleted}
                aria-label={
                  isCompleted
                    ? "Markera uppgiften som pågående"
                    : "Markera uppgiften som klar"
                }
                onClick={toggleAssignment}
              >
                {isCompleted ? "✓" : ""}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`font-bold ${
                      isCompleted ? "text-[#8591a5] line-through" : ""
                    }`}
                  >
                    {assignment.title}
                  </h3>

                  <span className="rounded-lg bg-[#ded8ff] px-2 py-1 text-[10px] font-bold text-[#6257a6]">
                    Software life cycle management
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-[#8591a5]">
                  {assignment.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                <span className="rounded-lg bg-[#fff3cb] px-2 py-1 text-[10px] font-bold text-[#86641d]">
                  {isCompleted ? "Klar" : statusLabels[assignment.status]}
                </span>

                <span className="text-xs text-[#8591a5]">
                  {formatDeadline(assignment.deadline)}
                </span>
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
