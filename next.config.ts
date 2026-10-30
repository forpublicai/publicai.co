import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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
      {
        source: '/huggingface',
        destination: '/stories/huggingface',
        permanent: true,
      },
      {
        source: '/apertus',
        destination: '/stories/apertus',
        permanent: true,
      },
      {
        source: '/apertus-1-5',
        destination: '/stories/apertus-1-5',
        permanent: true,
      },
      {
        source: '/airbus',
        destination: '/stories/airbus',
        permanent: true,
      },
      {
        source: '/utility',
        destination: '/stories/utility',
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
})

export default withMDX(nextConfig);
