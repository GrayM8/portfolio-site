"use client";

import { useEffect, useState } from "react";

type SearchCommit = {
  commit: { author: { date: string } };
  repository: { full_name: string };
};

type SearchResponse = {
  total_count?: number;
  items?: SearchCommit[];
  message?: string;
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

    // 30-day window ending today (UTC date boundary is fine — small drift)
    const sinceDate = new Date();
    sinceDate.setUTCDate(sinceDate.getUTCDate() - (DAYS - 1));
    const sinceISO = sinceDate.toISOString().slice(0, 10);

    const q = `author:${username} author-date:>=${sinceISO}`;
    const url = `https://api.github.com/search/commits?q=${encodeURIComponent(q)}&per_page=100&sort=author-date&order=desc`;

    fetch(url, {
      signal: ac.signal,
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    })
      .then((r) =>
        r.ok ? (r.json() as Promise<SearchResponse>) : Promise.reject(new Error(String(r.status))),
      )
      .then((body) => {
        const items = body.items ?? [];
        const daily = new Array<number>(DAYS).fill(0);
        const repos = new Set<string>();
        const todayStart = startOfDay(new Date());
        const dayMs = 24 * 60 * 60 * 1000;

        for (const it of items) {
          const committedAt = new Date(it.commit.author.date);
          const diffDays = Math.floor((todayStart - startOfDay(committedAt)) / dayMs);
          if (diffDays < 0 || diffDays >= DAYS) continue;
          daily[DAYS - 1 - diffDays] += 1;
          repos.add(it.repository.full_name);
        }

        let streak = 0;
        for (let i = DAYS - 1; i >= 0; i--) {
          if (daily[i] > 0) streak++;
          else break;
        }

        setData({
          daily,
          totalCommits: body.total_count ?? items.length,
          reposTouched: repos.size,
          streak,
          lastSynced: Date.now(),
        });
      })
      .catch(() => {
        // UI falls back to placeholders
      });

    return () => ac.abort();
  }, [username]);

  return data;
}
