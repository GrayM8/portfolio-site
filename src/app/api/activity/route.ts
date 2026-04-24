import { NextResponse, type NextRequest } from "next/server";

type ContributionDay = { date: string; contributionCount: number };
type GraphQLResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: ContributionDay[] }[];
        };
        totalCommitContributions: number;
        totalPullRequestReviewContributions: number;
        totalRepositoriesWithContributedCommits: number;
      };
    } | null;
  };
  errors?: { message: string }[];
};

type GithubActivity = {
  daily: number[];
  dates: string[];
  eventsTotal: number;
  reviewsGiven: number;
  reposTouched: number;
  commitsMade: number;
  streak: number;
  lastSynced: number;
};

const DAYS = 30;
// GitHub's contribution calendar buckets days in the user's profile timezone.
// Hardcoded to Gray's TZ so the last slot is always "today in Austin," not a
// phantom tomorrow-in-UTC partial that GitHub pads in when the query window
// crosses UTC midnight.
const CALENDAR_TZ = "America/Chicago";

export const revalidate = 0;

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount }
          }
        }
        totalCommitContributions
        totalPullRequestReviewContributions
        totalRepositoriesWithContributedCommits
      }
    }
  }
`;

function todayInTz(tz: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: tz });
}

function shiftDate(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const user = req.nextUrl.searchParams.get("user");
  if (!user || !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(user)) {
    return NextResponse.json({ error: "invalid_user" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "missing_token" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const to = new Date();
  const from = new Date(to.getTime() - (DAYS + 1) * 24 * 60 * 60 * 1000);

  const debug = req.nextUrl.searchParams.get("debug") === "1";

  const upstream = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "portfolio-site",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { login: user, from: from.toISOString(), to: to.toISOString() },
    }),
    cache: "no-store",
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream", status: upstream.status },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const payload = (await upstream.json()) as GraphQLResponse;
  if (payload.errors?.length || !payload.data?.user) {
    return NextResponse.json(
      { error: "graphql", messages: payload.errors?.map((e) => e.message) ?? [] },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const cc = payload.data.user.contributionsCollection;
  const flat: ContributionDay[] = cc.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  const todayStr = todayInTz(CALENDAR_TZ);
  const earliest = shiftDate(todayStr, -(DAYS - 1));
  const byDate = new Map(flat.map((d) => [d.date, d.contributionCount]));

  const dates: string[] = [];
  const daily: number[] = [];
  for (let i = 0; i < DAYS; i++) {
    const date = shiftDate(earliest, i);
    dates.push(date);
    daily.push(byDate.get(date) ?? 0);
  }

  if (debug) {
    return NextResponse.json(
      {
        window: { from: from.toISOString(), to: to.toISOString(), todayStr, earliest },
        raw: payload.data.user.contributionsCollection,
        aligned: { dates, daily },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  let streak = 0;
  for (let i = DAYS - 1; i >= 0; i--) {
    if (daily[i] > 0) streak++;
    else break;
  }

  const activity: GithubActivity = {
    daily,
    dates,
    eventsTotal: daily.reduce((a, b) => a + b, 0),
    reviewsGiven: cc.totalPullRequestReviewContributions,
    reposTouched: cc.totalRepositoriesWithContributedCommits,
    commitsMade: cc.totalCommitContributions,
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
