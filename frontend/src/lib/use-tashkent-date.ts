"use client";

import { useTranslations } from "next-intl";
import { tashkentParts } from "./tashkent-date";

/**
 * Formats a moment in Tashkent time, e.g. "5-dekabr 2026, 17:00". Uses our own
 * month names: browsers lack Uzbek date patterns ("2026 M12 5"), and the
 * server and browser formatting differently breaks hydration.
 */
export function useTashkentDate() {
  const t = useTranslations("Dates");
  const months = t.raw("months") as string[];

  return (value: Date | string) => {
    const { year, month, day, time } = tashkentParts(value);
    return t("dateTime", { day, month: months[month], year, time });
  };
}
