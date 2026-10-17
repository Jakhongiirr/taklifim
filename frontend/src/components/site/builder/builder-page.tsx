import { getTranslations } from "next-intl/server";
import type { Music, Taklif } from "@/lib/api-types";
import { Link } from "@/i18n/navigation";
import SiteHeader from "../site-header";
import InvitationBuilder from "./invitation-builder";
import type { Design } from "./types";

/** Shared frame of the create and edit pages. */
export default async function BuilderPage({
  designs,
  tracks,
  taklif,
  initialThemeId,
}: {
  designs: Design[];
  tracks: Music[];
  taklif?: Taklif;
  initialThemeId?: string;
}) {
  const t = await getTranslations("Builder");
  // The plov design is an osh, not a wedding party: its own title.
  const osh =
    (taklif?.theme.themeId ??
      designs.find((design) => design.id === initialThemeId)?.key) === "plov";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 sm:px-6 sm:pt-10">
        <Link href="/cabinet" className="text-sm text-muted hover:text-ink">
          ← {t("back")}
        </Link>
        <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
          {taklif
            ? t(osh ? "osh.titleEdit" : "titleEdit")
            : t(osh ? "osh.titleNew" : "titleNew")}
        </h1>
        <p className="mt-2 mb-6 text-sm text-muted">
          {taklif?.status === "published" ? t("publishedNote") : t("subtitle")}
        </p>
        <InvitationBuilder
          designs={designs}
          tracks={tracks}
          taklif={taklif}
          initialThemeId={initialThemeId}
        />
      </main>
    </>
  );
}
