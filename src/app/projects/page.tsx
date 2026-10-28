import type { Metadata } from "next";
import { MaxWidthWrapper } from "@/components/global/max-width-wrapper";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Blogs } from "@/components/blog/blogs";
import { getAllPosts } from "@/utils/blog";

export const metadata: Metadata = {
  title: "Projects, Case Studies & Stories | Public AI",
  description:
    "Explore case studies, sovereign model launches, partner engineering stories, and policy essays from across the Public AI Inference Utility and Public AI Network.",
  openGraph: {
    title: "Projects, Case Studies & Stories | Public AI",
    description:
      "Explore case studies, sovereign model launches, partner engineering stories, and policy essays from across the Public AI ecosystem.",
    url: "https://publicai.co/projects",
    type: "website",
  },
};

export default function ProjectsIndexPage() {
  const posts = getAllPosts({ sortOrder: "newest" });

  return (
    <div className="py-12 md:py-20">
      <MaxWidthWrapper className="flex flex-col gap-12">
        <SectionHeader
          badge="Movement · Projects & Stories"
          badgeVariant="teal"
          title="Real Projects,"
          accentText="Real People."
          accentColor="red"
          description="Case studies, sovereign model launches, partner infrastructure breakdowns, and policy essays from across the Public AI Inference Utility and Public AI Research Network."
          align="center"
        />

        <Blogs posts={posts} />
      </MaxWidthWrapper>
    </div>
  );
}
