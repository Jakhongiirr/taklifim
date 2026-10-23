import type { Occasion } from "@/lib/api-types";

/**
 * The messages with the wording that names the occasion (cover line, letter,
 * date and countdown headings): Invitation.wedding or Invitation.fotiha,
 * which have the same keys. Wedding when unset.
 */
export function occasionMessages({ occasion }: { occasion?: Occasion }) {
  return occasion === "fotiha"
    ? ("Invitation.fotiha" as const)
    : ("Invitation.wedding" as const);
}
