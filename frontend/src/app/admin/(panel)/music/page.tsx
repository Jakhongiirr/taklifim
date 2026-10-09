import type { Metadata } from "next";
import MusicManager from "@/components/admin/music-manager";

export const metadata: Metadata = { title: "Music" };

export default function MusicPage() {
  return <MusicManager />;
}
