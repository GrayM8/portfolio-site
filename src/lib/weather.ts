"use client";

import { useEffect, useState } from "react";

const ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=30.2672&longitude=-97.7431&current=temperature_2m&temperature_unit=fahrenheit";

export function useAustinTemp(): number | null {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch(ENDPOINT, { signal: ac.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { current?: { temperature_2m?: number } }) => {
        const t = data?.current?.temperature_2m;
        if (typeof t === "number") setTemp(Math.round(t));
      })
      .catch(() => {
        // swallow — masthead will just show "Austin, TX" without the temp
      });
    return () => ac.abort();
  }, []);

  return temp;
}
