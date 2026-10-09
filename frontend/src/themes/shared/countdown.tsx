"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

function remaining(target: number, now: number) {
  const s = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

// A clock ticking once a second, as an external store. On the server (and
// while hydrating) it reads null, so server and browser clocks never clash.
function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000) * 1000;
const noClock = () => null;

/** Live countdown to the event; placeholders until it runs in the browser. */
export default function Countdown({
  eventAt,
  boxClassName = "rounded-2xl py-3",
}: {
  eventAt: string;
  boxClassName?: string;
}) {
  const t = useTranslations("Invitation.countdown");
  const target = new Date(eventAt).getTime();
  const now = useSyncExternalStore(subscribe, nowInSeconds, noClock);

  if (now !== null && now >= target) {
    return <p className="text-center text-sm text-muted">{t("passed")}</p>;
  }
  const left = now === null ? null : remaining(target, now);

  return (
    <div className="grid grid-cols-4 gap-2" role="timer">
      {UNITS.map((unit) => (
        <div
          key={unit}
          className={`flex flex-col items-center ${boxClassName}`}
        >
          <span className="font-serif text-3xl tabular-nums">
            {left ? String(left[unit]).padStart(2, "0") : "––"}
          </span>
          <span className="text-[11px] tracking-wide uppercase opacity-70">
            {t(unit)}
          </span>
        </div>
      ))}
    </div>
  );
}
