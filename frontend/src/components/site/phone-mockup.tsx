import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { designPreview } from "@/content/designs";
import { yeseva } from "@/themes/arcade/fonts";
import { greatVibes } from "@/themes/aurora/fonts";
import { marck } from "@/themes/violet/fonts";
import { playfair } from "@/themes/paris/fonts";
import { doveScript } from "@/themes/dove/fonts";
import { prata } from "@/themes/haven/fonts";
import { cormorant } from "@/themes/classic/fonts";
import { lavelScript } from "@/themes/lavel/fonts";

/** Seconds each design stays on the phone. */
const TURN = 4;

/**
 * The real designs, as their demo shot (designPreview), the name under
 * the phone in the theme's typeface. Shots wider than the screen are shown
 * whole on their own paper colour instead of being cropped (their words
 * then sit above and below the middle, where the music card floats).
 */
const DESIGNS = [
  { id: "aurora", name: "Aurora", font: greatVibes.className },
  {
    id: "classic",
    name: "Classic",
    font: `${cormorant.className} italic`,
    paper: "#f9f6ef",
    ratio: "720/1019",
  },
  { id: "dove", name: "Dove", font: doveScript },
  { id: "haven", name: "Haven", font: prata.className },
  {
    id: "lavel",
    name: "Lavel",
    font: lavelScript,
    paper: "#f4f1fa",
    ratio: "720/1000",
  },
  { id: "arcade", name: "Arcade", font: yeseva.className },
  { id: "violet", name: "Violet", font: marck.className },
  { id: "paris", name: "Paris", font: `${playfair.className} italic` },
] as const satisfies readonly {
  id: string;
  name: string;
  font: string;
  paper?: string;
  ratio?: string;
}[];

/** Design `i`'s turn in the cycle (negative delays: all start at once). */
const turn = (i: number, animation: string): CSSProperties => ({
  animation: `${animation} ${TURN * DESIGNS.length}s linear infinite`,
  animationDelay: `-${((DESIGNS.length - i) % DESIGNS.length) * TURN}s`,
});

/**
 * The hero's sample: a phone showing the real designs in turn (each as
 * its demo shot), a gold arch behind and two floating feature
 * cards. With reduced motion the first design stays.
 */
export default async function PhoneMockup() {
  const t = await getTranslations("HomePage.mock");

  return (
    <div className="relative mx-auto w-[228px] py-6 sm:w-[260px]">
      {/* Glow and a thin wedding arch behind the phone. */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[160%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,132,79,0.24),rgba(70,82,63,0.08)_45%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute inset-x-[-14%] top-0 bottom-[14%] -z-10 rounded-t-full border border-b-0 border-gold/35 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-[-8%] top-[4%] bottom-[14%] -z-10 rounded-t-full border border-b-0 border-gold/20 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      />

      <Phone>
        {DESIGNS.map((d, i) => (
          <div
            key={d.name}
            aria-hidden={i > 0}
            className={`absolute inset-0 motion-reduce:!animate-none ${i > 0 ? "motion-reduce:hidden" : ""}`}
            style={turn(i, "mock-turn")}
          >
            <div
              className="absolute inset-0 motion-reduce:!animate-none"
              style={{
                ...turn(i, "mock-zoom"),
                backgroundColor: "paper" in d ? d.paper : undefined,
              }}
            >
              {"paper" in d ? (
                // Its own box, so the shot's top and bottom fade into the paper.
                <div
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 [mask-image:linear-gradient(transparent,black_12%,black_88%,transparent)]"
                  style={{ aspectRatio: d.ratio }}
                >
                  <Image
                    src={designPreview(d.id)}
                    alt=""
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <Image
                  src={designPreview(d.id)}
                  alt=""
                  fill
                  sizes="260px"
                  priority={i === 0}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </Phone>

      {/* Which design is on: its name over a dot each. */}
      <div aria-hidden className="mt-5 flex flex-col items-center gap-2">
        <span className="relative h-5 w-24">
          {DESIGNS.map((d, i) => (
            <span
              key={d.name}
              className={`${d.font} absolute inset-0 text-center text-lg leading-5 text-ink/80 motion-reduce:!animate-none ${i > 0 ? "motion-reduce:hidden" : ""}`}
              style={turn(i, "mock-turn")}
            >
              {d.name}
            </span>
          ))}
        </span>
        <span className="flex gap-1.5">
          {DESIGNS.map((d, i) => (
            <span
              key={d.name}
              className="relative h-1.5 w-1.5 overflow-hidden rounded-full bg-gold/25"
            >
              <span
                className={`absolute inset-0 rounded-full bg-gold motion-reduce:!animate-none ${i > 0 ? "motion-reduce:hidden" : ""}`}
                style={turn(i, "mock-turn")}
              />
            </span>
          ))}
        </span>
      </div>

      {/* Floating feature cards, over the art (never the text). */}
      <FloatingCard className="top-[13%] -right-10 sm:-right-16">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-paper">
            <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 size-3.5">
              <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-left">
            <span className="block text-xs font-medium text-ink">
              {t("videoTitle")}
            </span>
            <span className="block text-[11px] text-muted">
              {t("videoText")}
            </span>
          </span>
        </div>
      </FloatingCard>
      <FloatingCard className="top-[45%] -left-10 sm:-left-20" delay="1.5s">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage text-paper">
            <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-full w-[3px] origin-bottom rounded-full bg-current motion-safe:animate-[bars_0.9s_ease-in-out_infinite]"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          </span>
          <span className="text-left">
            <span className="block text-xs font-medium text-ink">
              {t("musicTitle")}
            </span>
            <span className="block text-[11px] text-muted">
              {t("musicText")}
            </span>
          </span>
        </div>
      </FloatingCard>
    </div>
  );
}

/** A phone frame: bezel, side buttons, status bar, camera and glass shine. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Side buttons. */}
      <span className="absolute top-[18%] -left-[3px] h-8 w-[3px] rounded-l bg-[#3a3530]" />
      <span className="absolute top-[28%] -left-[3px] h-12 w-[3px] rounded-l bg-[#3a3530]" />
      <span className="absolute top-[24%] -right-[3px] h-16 w-[3px] rounded-r bg-[#3a3530]" />

      <div className="aspect-[9/19.5] rounded-[3rem] bg-gradient-to-b from-[#3d3832] to-[#25221f] p-[7px] shadow-[0_40px_80px_-20px_rgba(42,39,35,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
        <div className="relative h-full overflow-hidden rounded-[2.55rem] bg-cream">
          {children}
          {/* Status bar over the art, on a soft light band. */}
          <div className="absolute inset-x-0 top-0 flex h-9 items-center justify-between bg-gradient-to-b from-white/50 to-transparent px-6 pt-1 text-[10px] font-semibold text-ink">
            <span>9:41</span>
            <span className="flex items-center gap-1" aria-hidden>
              <svg viewBox="0 0 18 12" className="h-2.5">
                <path
                  d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V4H9zM13 11h2V1h-2z"
                  fill="currentColor"
                />
              </svg>
              <span className="flex h-2.5 w-5 items-center rounded-[3px] border border-ink/70 p-[1px]">
                <span className="h-full w-3/4 rounded-[1px] bg-ink" />
              </span>
            </span>
          </div>
          <span
            aria-hidden
            className="absolute top-2 left-1/2 h-[22px] w-[76px] -translate-x-1/2 rounded-full bg-[#1d1b18]"
          />
          {/* Soft glass reflection. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.3)_0%,transparent_28%)]"
          />
        </div>
      </div>
    </div>
  );
}

function FloatingCard({
  className,
  delay = "0s",
  children,
}: {
  className: string;
  delay?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-2xl bg-white/90 px-4 py-3 shadow-[0_12px_30px_-10px_rgba(42,39,35,0.25)] ring-1 ring-line backdrop-blur motion-safe:animate-[float_4s_ease-in-out_infinite_alternate] ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}
