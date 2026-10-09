import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Self-contained server in .next/standalone, used by the production image.
  output: "standalone",
  // cacheComponents is off: with it on (Next 16.4), notFound() under the
  // [locale] root layout ships an empty error page instead of not-found.tsx.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
