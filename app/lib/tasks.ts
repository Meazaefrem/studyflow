// De tre statusar som en uppgift kan ha.
export type TaskStatus = "upcoming" | "in-progress" | "done";

// Kurserna används i formuläret när en ny uppgift skapas.
export const courseOptions = [
  "JSU25S - Software life cycle management, 40 yhp",
  "JSU25S - LIA 2, 80 yhp",
  "JSU25S - Examensarbetet, 20 yhp",
] as const;

export type CourseName = (typeof courseOptions)[number];

// Färgtema för kursens etikett i gränssnittet.
export type CourseTone = "lilac" | "mint" | "yellow";

export type StudyTask = {
  id: string;
  title: string;
  course: CourseName;
  deadline: string | null;
  status: TaskStatus;
  description: string;
  tone: CourseTone;
};

// Den första uppgiften som visas när localStorage är tom.
export const seedTasks: StudyTask[] = [
  {
    id: "task-ci-cd-render",
    title:
      "Individuell inlämningsuppgift – CI/CD, Docker och molndrift med Render",
    course: "JSU25S - Software life cycle management, 40 yhp",
    deadline: "2026-11-15T23:59:00",
    status: "upcoming",
    description:
      "Bygg en Next.js-applikation, containerisera den med Docker, skapa GitHub Actions och driftsätt applikationen på Render.",
    tone: "lilac",
  },
];

export const statusLabels: Record<TaskStatus, string> = {
  upcoming: "Inte påbörjad",
  "in-progress": "Pågående",
  done: "Klar",
};

export const statusTone: Record<TaskStatus, string> = {
  upcoming: "status-upcoming",
  "in-progress": "status-progress",
  done: "status-done",
};

// datetime-local kan ge ett datum utan klockslag. Då lägger vi till lunch
// så att webbläsaren inte råkar visa fel dag på grund av tidszon.
function parseDeadline(date: string) {
  const dateWithTime = date.includes("T")
    ? date
    : `${date}T12:00:00`;

  return new Date(dateWithTime);
}

export function formatDeadline(date: string | null) {
  if (!date) {
    return "Ingen deadline angiven";
  }

  const parsedDate = parseDeadline(date);

  const formattedDate = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
  }).format(parsedDate);

  const formattedTime = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);

  return `${formattedDate} · ${formattedTime}`;
}

export function formatLongDeadline(date: string | null) {
  if (!date) {
    return "Ingen deadline angiven";
  }

  const parsedDate = parseDeadline(date);

  const formattedDate = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);

  const formattedTime = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);

  return `${formattedDate} · ${formattedTime}`;
}
