import Image from "next/image";

/**
 * The photos (1–6) as a framed grid of rounded rectangles: groups of three
 * as a tall frame beside two small ones, alternating sides; one left over
 * spans the width, two left over stand side by side, a single photo is one
 * big frame. Themes style the frames (`frameClass`: background, padding,
 * ring, their reveal class).
 */
export default function Moments({
  photos,
  alt,
  frameClass,
}: {
  photos: { id: string; url: string }[];
  /** For the first photo; the others are decorative. */
  alt: string;
  frameClass: string;
}) {
  const full = photos.length - (photos.length % 3);
  const shape = (i: number) => {
    if (i < full) {
      // The tall frame is first in even groups (left), middle in odd (right).
      const tall = Math.floor(i / 3) % 2 ? i % 3 === 1 : i % 3 === 0;
      return tall ? "row-span-2" : "";
    }
    if (photos.length === 1) return "col-span-2 row-span-3";
    return photos.length - full === 1 ? "col-span-2 row-span-2" : "row-span-2";
  };

  return (
    <div className="grid auto-rows-[8.5rem] grid-flow-dense grid-cols-2 gap-3">
      {photos.map((photo, i) => (
        <figure
          key={photo.id}
          className={`rounded-2xl ${frameClass} ${shape(i)}`}
        >
          <div className="relative size-full overflow-hidden rounded-xl">
            <Image
              src={photo.url}
              alt={i === 0 ? alt : ""}
              fill
              unoptimized
              sizes="(min-width: 448px) 448px, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
