import type { TaklifStatus } from "@/lib/api-types";

// Links from the admin panel into the public site. Admins can open any
// invitation's preview and replies there (the site checks owner or admin).

/** The guest page when it's public, the owner's preview otherwise. */
export function invitationUrl(slug: string, status: TaklifStatus) {
  return status === "published"
    ? `/uz/taklif/${slug}`
    : `/uz/taklif/${slug}/preview`;
}

/** Guests' replies and wishes, where they can be liked or deleted. */
export function repliesUrl(slug: string) {
  return `/uz/cabinet/responses/${slug}`;
}
