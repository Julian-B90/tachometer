import { useEffect, useRef, useState } from "react";
import { DockerStats } from "./useStats";

const STORAGE_KEY = "tachometer-history";
const MAX_ENTRIES = 2000;
const SAVE_INTERVAL = 30000;

export interface HistoryEntry {
  timestamp: number;
  stats: DockerStats[];
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  const trimmed = entries.slice(-MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function useHistory(currentStats: DockerStats[] | undefined) {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const lastSaveRef = useRef<number>(0);

  useEffect(() => {
    if (!currentStats || currentStats.length === 0) return;

    const now = Date.now();
    if (now - lastSaveRef.current < SAVE_INTERVAL) return;

    lastSaveRef.current = now;
    const entry: HistoryEntry = { timestamp: now, stats: currentStats };
    setHistory((prev) => {
      const next = [...prev, entry];
      saveHistory(next);
      return next;
    });
  }, [currentStats]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, clearHistory };
}

export function getHistoryForContainer(history: HistoryEntry[], containerId: string) {
  return history
    .map((entry) => {
      const container = entry.stats.find((s) => s.ID === containerId);
      if (!container) return null;
      return {
        timestamp: entry.timestamp,
        stats: container,
      };
    })
    .filter(Boolean) as { timestamp: number; stats: DockerStats }[];
}
