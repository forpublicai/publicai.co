import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // PostHog reverse proxy rewrites: prevents trailing slash redirects for ingestion endpoints
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  async redirects() {
    return [
      // 1. Stories directory to Projects blog migration
      {
        source: "/stories",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/stories/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      // 2. Legacy root story aliases
      {
        source: "/huggingface",
        destination: "/projects/huggingface",
        permanent: true,
      },
      {
        source: "/apertus",
        destination: "/projects/apertus",
        permanent: true,
      },
      {
        source: "/apertus-1-5",
        destination: "/projects/apertus-1-5",
        permanent: true,
      },
      {
        source: "/airbus",
        destination: "/projects/airbus",
        permanent: true,
      },
      {
        source: "/utility",
        destination: "/projects/utility",
        permanent: true,
      },
      // 3. Product & legal aliases
      {
        source: "/libraries",
        destination: "/kiosks",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/tc#1-terms-of-service",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/tc#2-privacy-policy",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
