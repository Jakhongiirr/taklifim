import { notFound } from "next/navigation";

// Unknown /admin/* paths get the admin 404 instead of the localized site's.
export default function AdminCatchAll() {
  notFound();
}
