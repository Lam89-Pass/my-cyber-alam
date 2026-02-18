import { useState, useEffect, useCallback } from "react";
import { IScanResult } from "@/types";

export interface IHistoryEntry {
  id: string;
  result: IScanResult;
  savedAt: string; // ISO string biar bisa di-JSON
}

const STORAGE_KEY = "cyberalam_scan_history";
const MAX_HISTORY = 20;

export function useScanHistory() {
  const [history, setHistory] = useState<IHistoryEntry[]>([]);

  // Load dari localStorage saat mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: IHistoryEntry[] = JSON.parse(raw);
        setHistory(parsed);
      }
    } catch {
      // Kalau corrupt, reset
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const save = useCallback((entries: IHistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Storage penuh, buang yang paling lama
    }
  }, []);

  const addEntry = useCallback((result: IScanResult) => {
    setHistory(prev => {
      const entry: IHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        result: {
          ...result,
          scannedAt: new Date(result.scannedAt), // pastikan Date object
        },
        savedAt: new Date().toISOString(),
      };
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      save(updated);
      return updated;
    });
  }, [save]);

  const removeEntry = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(e => e.id !== id);
      save(updated);
      return updated;
    });
  }, [save]);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearAll };
}