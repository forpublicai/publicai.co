import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/utils/blog";
import { formatDate } from "@/utils/format-date";

export const alt = "Public AI Project & Story";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "Public AI Inference Utility";
  const category = post?.category ?? "Projects & Case Studies";
  const description =
    post?.description ??
    "A nonprofit, open-source utility and research coalition making public and sovereign AI accessible to everyone.";
  const author = post?.author ?? "Public AI Team";
  const dateLabel = post?.datePublished ? formatDate(post.datePublished) : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F2D4A",
          color: "#FFFFFF",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Row: Brand Lockup + Category Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#FF3B30",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 800,
                color: "#FFFFFF",
              }}
            >
              ≥
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                <span>Public</span>
                <span style={{ color: "#FF3B30" }}>.AI</span>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  color: "#E8F4F8",
                  textTransform: "uppercase",
                }}
              >
                INFERENCE UTILITY
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(0, 179, 164, 0.2)",
              border: "2px solid #00B3A4",
              color: "#E8F4F8",
              borderRadius: "9999px",
              padding: "8px 22px",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            {category}
          </div>
        </div>

        {/* Middle Row: Title & Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "1020px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 55 ? "48px" : "56px",
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.4,
              color: "#CBD5E1",
            }}
          >
            {description.length > 160
              ? `${description.slice(0, 157)}...`
              : description}
          </div>
        </div>

        {/* Bottom Row: Author, Date & Accent Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "2px solid rgba(232, 244, 248, 0.16)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "20px",
              color: "#E8F4F8",
            }}
          >
            <span style={{ fontWeight: 700 }}>{author}</span>
            {dateLabel && <span style={{ color: "#00B3A4" }}>•</span>}
            {dateLabel && <span style={{ color: "#CBD5E1" }}>{dateLabel}</span>}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#00B3A4",
            }}
          >
            publicai.co/projects
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
