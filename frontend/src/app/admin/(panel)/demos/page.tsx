import type { Metadata } from "next";
import DemosManager from "@/components/admin/demos-manager";

export const metadata: Metadata = { title: "Demos" };

export default function DemosPage() {
  return <DemosManager />;
}
