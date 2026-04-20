"use client";

import { useRef, useState, type MouseEvent } from "react";
import type { Palette } from "./palette";

export type FeatureTileProject = {
  title: string;
  slug?: string;
  image?: string;
  video?: string;
};

type Props = {
  p: FeatureTileProject;
  c: Palette;
  /** Index — used for FIG label when `label` not supplied */
  idx?: number;
  /** When true, rests tilted right; otherwise tilted left. */
  isEven?: boolean;
  /** Override for the top-left corner label. */
  label?: string;
  /** Force aspect ratio (CSS value). Defaults to "5/3" when video, otherwise "16/10". */
  aspect?: string;
};

export function FeatureTile({
  p,
  c,
  idx,
  isEven = true,
  label,
  aspect,
}: Props) {
  const restRotateY = isEven ? 8 : -8;
  const restRotateX = -4;
  const [tilt, setTilt] = useState({
    x: restRotateX,
    y: restRotateY,
    s: 1,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const xPct = (e.clientX - r.left) / r.width - 0.5;
    const yPct = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ y: xPct * 22, x: yPct * -22, s: 1.03 });
  };
  const onMouseLeave = () => {
    setTilt({ x: restRotateX, y: restRotateY, s: 1 });
  };

  const computedAspect = aspect ?? (p.video ? "5 / 3" : "16 / 10");
  const computedLabel =
    label ?? (p.slug ? `FIG. 0${(idx ?? 0) + 2} · ${p.slug}` : undefined);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="o3-feat-frame relative overflow-hidden border border-[color:var(--rule)]"
      style={{
        aspectRatio: computedAspect,
        background: c.soft,
        transformStyle: "preserve-3d",
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.s})`,
        transition: "transform .45s cubic-bezier(.2,.8,.2,1)",
        boxShadow:
          "0 30px 60px -24px rgba(0,0,0,0.35), 0 18px 36px -18px rgba(0,0,0,0.25)",
      }}
    >
      {p.video ? (
        <video
          src={p.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.image}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}
      {computedLabel && (
        <div
          className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border pointer-events-none"
          style={{ background: c.bg, borderColor: c.rule, color: c.ink }}
        >
          {computedLabel}
        </div>
      )}
    </div>
  );
}
