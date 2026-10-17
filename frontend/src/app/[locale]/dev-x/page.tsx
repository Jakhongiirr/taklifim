import { ThemedInvitation } from "@/themes";

export default async function Dev({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const t = (await searchParams).t ?? "aurora";
  return (
    <ThemedInvitation
      taklif={{
        slug: "x", brideName: "Madina", groomName: "Jasur", hostName: "Karimovlar",
        eventAt: "2026-11-20T13:00:00Z", venueName: "Navro'z", venueAddress: "Toshkent",
        locationUrl: null, photos: [], cardNumber: null, phone: null, music: null,
        theme: { themeId: t },
      }}
    />
  );
}
