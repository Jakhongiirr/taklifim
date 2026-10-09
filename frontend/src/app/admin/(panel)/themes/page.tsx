import type { Metadata } from "next";
import ThemesManager from "@/components/admin/themes-manager";

export const metadata: Metadata = { title: "Themes" };

export default function ThemesPage() {
  return <ThemesManager />;
}
