import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "snad-session-id";

// Host-based redirect mappings for publicai.network -> publicai.co
function resolveNetworkDestination(pathname: string): string {
  const clean = pathname.replace(/\/$/, "");

  // Root
  if (!clean || clean === "") {
    return "https://publicai.co/research";
  }

  // Whitepaper PDF
  if (
    clean === "/PublicAIwhitepaper.pdf" ||
    clean === "/whitepaper/PublicAIwhitepaper.pdf" ||
    clean === "/whitepaper"
  ) {
    return "https://publicai.co/PublicAIwhitepaper.pdf";
  }

  // Libraries -> Kiosks
  if (clean === "/libraries" || clean === "/libraries.html") {
    return "https://publicai.co/kiosks";
  }

  // Unlisted blog posts mapped to /projects/[slug]
  if (clean === "/journalism" || clean === "/journalism.html") {
    return "https://publicai.co/projects/journalism";
  }
  if (clean === "/creative" || clean === "/creative.html") {
    return "https://publicai.co/projects/creative";
  }
  if (clean === "/cursor-demo" || clean === "/cursor-demo.html") {
    return "https://publicai.co/projects/cursor-demo";
  }
  if (clean === "/maine" || clean === "/maine.html") {
    return "https://publicai.co/projects/maine";
  }
  if (clean === "/procurement" || clean === "/procurement.html") {
    return "https://publicai.co/projects/procurement";
  }
  if (clean === "/fiction" || clean === "/fiction.html") {
    return "https://publicai.co/projects/fiction";
  }
  if (clean === "/sail" || clean === "/sail.html") {
    return "https://publicai.co/projects/sail";
  }
  if (clean === "/sail/blog/decoding-sovereign-ai") {
    return "https://publicai.co/projects/decoding-sovereign-ai";
  }

  // SAIL subpages
  if (
    clean === "/sail/spec" ||
    clean === "/sail/spec.html" ||
    clean === "/sail/models" ||
    clean === "/sail/models.html" ||
    clean === "/sail/countries" ||
    clean === "/sail/countries.html" ||
    clean === "/sail/cases" ||
    clean === "/sail/cases.html" ||
    clean === "/sail/interests" ||
    clean === "/sail/interests.html"
  ) {
    const sub = clean.replace("/sail/", "").replace(".html", "");
    return `https://publicai.co/research/sail/${sub}`;
  }

  // Specific research aliases
  if (clean === "/advisory.html" || clean === "/advisory-board") {
    return "https://publicai.co/research/advisory-board";
  }
  if (clean === "/contributors") {
    return "https://publicai.co/research/contributing";
  }
  if (clean === "/atlas/README.html" || clean === "/atlas") {
    return "https://publicai.co/research/atlas";
  }

  // Preserve docs PDFs if requested
  if (clean.startsWith("/docs/")) {
    return `https://publicai.co${clean}`;
  }

  // Remove .html suffix if present
  const stripped = clean.endsWith(".html") ? clean.replace(/\.html$/, "") : clean;

  // Catch-all mapping to /research/...
  return `https://publicai.co/research${stripped}`;
}

// Host-based redirect mappings for platform.publicai.co -> publicai.co
function resolvePlatformDestination(pathname: string): string | null {
  const clean = pathname.replace(/\/$/, "");

  // Root or general docs index
  if (!clean || clean === "" || clean === "/docs") {
    return "https://publicai.co/docs";
  }

  // Exact verified documentation subpages from platform.publicai.co
  if (clean === "/docs/models" || clean === "/models") {
    return "https://publicai.co/models";
  }
  if (clean === "/docs/plans") {
    return "https://publicai.co/docs/plans";
  }
  if (clean === "/plans") {
    return "https://publicai.co/pricing";
  }
  if (clean === "/docs/inference-partners-faq" || clean === "/inference-partners-faq") {
    return "https://publicai.co/docs/inference-partners-faq";
  }
  if (clean === "/docs/support-us" || clean === "/support-us") {
    return "https://publicai.co/docs/support-us";
  }

  // OpenAPI 3.1 Reference
  if (clean === "/api") {
    return "https://publicai.co/docs/api";
  }

  // Notice: Developer console routes (/account/billing, /settings/api-keys)
  // are preserved on Zuplo and should NOT be redirected here.
  return null;
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();

  // 1. Handle publicai.network & www.publicai.network host-based 308 redirects
  if (host.includes("publicai.network")) {
    const destination = resolveNetworkDestination(request.nextUrl.pathname);
    return NextResponse.redirect(destination, 308);
  }

  // 2. Handle platform.publicai.co docs & marketing 308 redirects to publicai.co
  if (host.includes("platform.publicai.co")) {
    const destination = resolvePlatformDestination(request.nextUrl.pathname);
    if (destination) {
      return NextResponse.redirect(destination, 308);
    }
  }

  const response = NextResponse.next();

  // 3. Preserve snad-session-id cookie for /dialogue and /api/dialogue
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/dialogue") || pathname.startsWith("/api/dialogue")) {
    if (!request.cookies.get(COOKIE_NAME)) {
      const sessionId = crypto.randomUUID();
      response.cookies.set(COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
