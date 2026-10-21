"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { copyText } from "@/lib/copy-text";

/**
 * Copies a wording sample and confirms for a moment. Once copied, it points
 * on to making the invitation the text goes with.
 */
export default function CopySample({
  text,
  label,
  copiedLabel,
  nextLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
  nextLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const [used, setUsed] = useState(false);

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={async () => {
          if (!(await copyText(text))) return;
          setCopied(true);
          setUsed(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-sage px-5 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-paper"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4">
          {copied ? (
            <path
              d="m5 12 5 5 9-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          ) : (
            <path
              d="M9 9h10v11H9zM5 15V4h10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          )}
        </svg>
        <span aria-live="polite">{copied ? copiedLabel : label}</span>
      </button>
      {used && (
        <Link
          href="/cabinet/new"
          className="text-sm font-medium text-sage underline decoration-sage/40 underline-offset-4 hover:decoration-sage"
        >
          {nextLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
