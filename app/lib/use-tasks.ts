"use client";

import {
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { seedTasks, type StudyTask } from "./tasks";

const storageKey = "studyflow.tasks";

// Alla komponenter som använder hooken får veta när localStorage ändras.
const listeners = new Set<() => void>();

function getSnapshot() {
  if (typeof window === "undefined") {
    return JSON.stringify(seedTasks);
  }

  return (
    window.localStorage.getItem(storageKey) ??
    JSON.stringify(seedTasks)
  );
}

function getServerSnapshot() {
  return JSON.stringify(seedTasks);
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === storageKey) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function parseTasks(snapshot: string): StudyTask[] {
  try {
    const parsedTasks = JSON.parse(snapshot) as StudyTask[];

    return Array.isArray(parsedTasks)
      ? parsedTasks
      : seedTasks;
  } catch {
    return seedTasks;
  }
}

export function useTasks() {
  // useSyncExternalStore passar bra för localStorage och fungerar även
  // under Next.js server-rendering. Därför slipper vi en extra useEffect.
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Gör texten från localStorage till en vanlig lista med uppgifter.
  const tasks = useMemo(() => {
    return parseTasks(snapshot);
  }, [snapshot]);

  const setTasks = useCallback(
    (
      update:
        | StudyTask[]
        | ((currentTasks: StudyTask[]) => StudyTask[]),
    ) => {
      const currentTasks = parseTasks(getSnapshot());

      const nextTasks =
        typeof update === "function"
          ? update(currentTasks)
          : update;

      window.localStorage.setItem(
        storageKey,
        JSON.stringify(nextTasks),
      );

      // Uppdatera även komponenten på samma sida.
      listeners.forEach((listener) => listener());
    },
    [],
  );

  return {
    tasks,
    setTasks,
  };
}
