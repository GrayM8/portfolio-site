"use client";

import { useEffect, useState } from "react";

type GHPushPayload = { commits?: Array<unknown> };

type GHEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: GHPushPayload;
};

export type GithubActivity = {
  daily: number[];
  totalCommits: number;
  reposTouched: number;
  streak: number;
  lastSynced: number;
};

const DAYS = 30;

function startOfDay(d: Date): number {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

export function useGithubActivity(username: string): GithubActivity | null {
  const [data, setData] = useState<GithubActivity | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`;

    fetch(url, {
      signal: ac.signal,
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    })
      .then((r) =>
        r.ok ? (r.json() as Promise<GHEvent[]>) : Promise.reject(new Error(String(r.status))),
      )
      .then((events) => {
        const daily = new Array<number>(DAYS).fill(0);
        const repos = new Set<string>();
        const todayStart = startOfDay(new Date());
        const dayMs = 24 * 60 * 60 * 1000;

        for (const e of events) {
          if (e.type !== "PushEvent") continue;
          const evStart = startOfDay(new Date(e.created_at));
          const diffDays = Math.floor((todayStart - evStart) / dayMs);
          if (diffDays < 0 || diffDays >= DAYS) continue;
          const count = e.payload?.commits?.length ?? 0;
          if (count === 0) continue;
          daily[DAYS - 1 - diffDays] += count;
          repos.add(e.repo.name);
        }

        let streak = 0;
        for (let i = DAYS - 1; i >= 0; i--) {
          if (daily[i] > 0) streak++;
          else break;
        }

        setData({
          daily,
          totalCommits: daily.reduce((s, n) => s + n, 0),
          reposTouched: repos.size,
          streak,
          lastSynced: Date.now(),
        });
      })
      .catch(() => {
        // leave null; UI falls back to a flat placeholder
      });

    return () => ac.abort();
  }, [username]);

  return data;
}
