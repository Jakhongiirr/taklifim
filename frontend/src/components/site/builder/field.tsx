import type { ReactNode } from "react";

export const inputClass =
  "h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-sage focus:ring-2 focus:ring-sage/20 aria-[invalid=true]:border-red-400";

/** A labelled form control with an optional hint and error. */
export default function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? (
        <span className="text-sm text-red-700">{error}</span>
      ) : (
        hint && <span className="text-sm text-muted">{hint}</span>
      )}
    </label>
  );
}
