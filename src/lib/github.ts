"use client";

import { useEffect, useState } from "react";

type GHEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { action?: string };
};

export type GithubActivity = {
  daily: number[];
  eventsTotal: number;
  prsOpened: number;
  reviewsGiven: number;
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
        let prsOpened = 0;
        let reviewsGiven = 0;
        let eventsInWindow = 0;

        for (const e of events) {
          const diffDays = Math.floor(
            (todayStart - startOfDay(new Date(e.created_at))) / dayMs,
          );
          if (diffDays < 0 || diffDays >= DAYS) continue;

          daily[DAYS - 1 - diffDays] += 1;
          repos.add(e.repo.name);
          eventsInWindow += 1;

          if (e.type === "PullRequestEvent" && e.payload.action === "opened") {
            prsOpened += 1;
          } else if (
            e.type === "PullRequestReviewEvent" ||
            e.type === "PullRequestReviewCommentEvent"
          ) {
            reviewsGiven += 1;
          }
        }

        let streak = 0;
        for (let i = DAYS - 1; i >= 0; i--) {
          if (daily[i] > 0) streak++;
          else break;
        }

        setData({
          daily,
          eventsTotal: eventsInWindow,
          prsOpened,
          reviewsGiven,
          reposTouched: repos.size,
          streak,
          lastSynced: Date.now(),
        });
      })
      .catch(() => {
        // leave null; UI falls back to placeholders
      });

    return () => ac.abort();
  }, [username]);

  return data;
}
