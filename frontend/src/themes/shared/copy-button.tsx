"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { copyText } from "@/lib/copy-text";

/** Copies `value` (e.g. a card number) and confirms for a moment. */
export default function CopyButton({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const t = useTranslations("Invitation.gift");
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        if (!(await copyText(value))) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}
