import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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
