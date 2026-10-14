"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-text";

/** Copies a wording sample and confirms for a moment. */
export default function CopySample({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        if (!(await copyText(text))) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="mt-5 inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-sage px-5 text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-paper"
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
  );
}
