/** Thin gold divider with a small flourish, used on the site and in themes. */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 16"
      className={`h-4 w-28 text-gold ${className}`}
    >
      <path
        d="M2 8h42M76 8h42M60 2c-4 6-4 6 0 12 4-6 4-6 0-12Z M50 8a3 3 0 1 0 0 .1M70 8a3 3 0 1 0 0 .1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
