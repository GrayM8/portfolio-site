"use client";

import { useEffect, useState } from "react";

export type GithubActivity = {
  daily: number[];
  dates: string[];
  eventsTotal: number;
  reviewsGiven: number;
  reposTouched: number;
  commitsMade: number;
  streak: number;
  lastSynced: number;
};

function storageKey(user: string) {
  return `gm_activity_${user}`;
}

function readCache(user: string): GithubActivity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(user));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GithubActivity;
    if (
      !parsed ||
      !Array.isArray(parsed.daily) ||
      !Array.isArray(parsed.dates) ||
      parsed.dates.length !== parsed.daily.length ||
      typeof parsed.commitsMade !== "number" ||
      !parsed.lastSynced
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(user: string, data: GithubActivity) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(user), JSON.stringify(data));
  } catch {
    // quota or privacy mode — ignore
  }
}

export function useGithubActivity(username: string): GithubActivity | null {
  const [data, setData] = useState<GithubActivity | null>(null);

  useEffect(() => {
    // Hydrate instantly from any previous successful response.
    const cached = readCache(username);
    if (cached) setData(cached);

    const ac = new AbortController();
    fetch(`/api/activity?user=${encodeURIComponent(username)}`, {
      signal: ac.signal,
    })
      .then((r) => (r.ok ? (r.json() as Promise<GithubActivity>) : Promise.reject(new Error(String(r.status)))))
      .then((fresh) => {
        setData(fresh);
        writeCache(username, fresh);
      })
      .catch(() => {
        // keep whatever cached data we already displayed
      });

    return () => ac.abort();
  }, [username]);

  return data;
}
