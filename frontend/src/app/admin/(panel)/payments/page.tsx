import type { Metadata } from "next";
import PaymentsManager from "@/components/admin/payments-manager";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return <PaymentsManager />;
}
