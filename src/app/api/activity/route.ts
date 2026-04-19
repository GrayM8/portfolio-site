import { NextResponse, type NextRequest } from "next/server";

type GHEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { action?: string };
};

type GithubActivity = {
  daily: number[];
  eventsTotal: number;
  prsOpened: number;
  reviewsGiven: number;
  reposTouched: number;
  streak: number;
  lastSynced: number;
};

const DAYS = 30;
const TEN_MIN = 600;

function startOfDay(d: Date): number {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
}

export async function GET(req: NextRequest) {
  const user = req.nextUrl.searchParams.get("user");
  if (!user || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(user)) {
    return NextResponse.json({ error: "invalid_user" }, { status: 400 });
  }

  const url = `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=100`;
  const upstream = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-site",
    },
    next: { revalidate: TEN_MIN },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream", status: upstream.status },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const events = (await upstream.json()) as GHEvent[];
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

  const activity: GithubActivity = {
    daily,
    eventsTotal: eventsInWindow,
    prsOpened,
    reviewsGiven,
    reposTouched: repos.size,
    streak,
    lastSynced: Date.now(),
  };

  return NextResponse.json(activity, {
    headers: {
      "Cache-Control":
        "public, max-age=60, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
