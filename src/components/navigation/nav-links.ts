export interface NavSubFeature {
  title: string;
  href: string;
  badge?: string;
}

export interface NavPrimaryItem {
  title: string;
  href: string;
  description: string;
  badge?: string;
  external?: boolean;
  subFeatures?: NavSubFeature[];
}

export interface NavResourceItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavMegaSection {
  id: "products" | "movement";
  title: string;
  activePrefixes: string[];
  primaryHeading: string;
  primaryItems: NavPrimaryItem[];
  resourcesHeading: string;
  resourceItems: NavResourceItem[];
}

export const MEGA_MENU_SECTIONS: NavMegaSection[] = [
  {
    id: "products",
    title: "Products",
    activePrefixes: [
      "/products",
      "/chat",
      "/docs",
      "/models",
      "/pricing",
      "/kiosks",
      "/batch",
      "/voice",
      "/agents",
    ],
    primaryHeading: "Explore Products",
    primaryItems: [
      {
        title: "Chat",
        href: "/products/chat",
        description:
          "Free, multilingual Web Chat powered by sovereign open models with national RAG knowledgebases.",
        subFeatures: [
          {
            title: "Mobile App",
            href: "/products/chat#mobile",
            badge: "Coming Soon",
          },
        ],
      },
      {
        title: "API",
        href: "/products/api",
        description:
          "Unified OpenAI-compatible inference gateway serving open-source and sovereign models.",
        subFeatures: [
          {
            title: "Batch API",
            href: "/products/api#batch",
            badge: "Coming Soon",
          },
          {
            title: "Voice API",
            href: "/products/api#voice",
            badge: "Coming Soon",
          },
        ],
      },
      {
        title: "Kiosks",
        href: "/products/kiosks",
        badge: "Live Pilot",
        description:
          "Turnkey community AI workstations and local knowledge portals for public libraries.",
      },
      {
        title: "Agents",
        href: "/products/agents",
        badge: "Coming Soon",
        description:
          "Hermes autonomous agentic service built on inspectable open-weight models.",
      },
    ],
    resourcesHeading: "Resources",
    resourceItems: [
      {
        title: "API Documentation",
        href: "/docs",
        description: "Quickstart, authentication & OpenAPI 3.1 reference",
      },
      {
        title: "Models & Pricing",
        href: "/models",
        description: "Searchable open model directory & live token rates",
      },
      {
        title: "Plans & Rate Limits",
        href: "/pricing",
        description: "Free, Plus, Pro & Enterprise API tiers",
      },
      {
        title: "Chat Documentation",
        href: "/docs/chat",
        description: "Web chat, national prompts & RAG collections",
      },
      {
        title: "Kiosks Blog Post",
        href: "/projects/libraries",
        description: "Building Public AI with Libraries case study",
      },
      {
        title: "System Status",
        href: "https://status.publicai.co",
        description: "Live cluster uptime & service health",
        external: true,
      },
      {
        title: "API Keys & Billing",
        href: "https://platform.publicai.co/account/billing",
        description: "Manage keys, wallet balance & usage",
        external: true,
      },
    ],
  },
  {
    id: "movement",
    title: "Movement",
    activePrefixes: ["/projects", "/stories", "/research", "/contributing"],
    primaryHeading: "Explore the Movement",
    primaryItems: [
      {
        title: "Projects",
        href: "/projects",
        description:
          "Case studies, model launches, partner engineering stories, and policy essays.",
      },
      {
        title: "Research",
        href: "/research",
        description:
          "The Public AI Research Network, SAIL sovereignty standard, whitepaper, and atlas.",
      },
      {
        title: "Partners",
        href: "/contributing",
        description:
          "National supercomputing centers, model builders, and civic institutions powering Public AI.",
      },
    ],
    resourcesHeading: "Resources",
    resourceItems: [
      {
        title: "Research Seminars",
        href: "/research/seminar",
        description: "Global seminar series on public AI governance & tech",
      },
      {
        title: "Publications & Whitepaper",
        href: "/research/publications",
        description: "Policy briefs, ICML papers & the Public AI Whitepaper",
      },
      {
        title: "SAIL Specification",
        href: "/research/sail/spec",
        description: "7-layer Sovereign AI Leadership evaluation system",
      },
      {
        title: "Community Slack",
        href: "https://join.slack.com/t/publicainetwork/shared_invite/zt-2v79699b4-91~35241432692544",
        description: "Join researchers, builders & policymakers on Slack",
        external: true,
      },
      {
        title: "GitHub",
        href: "https://github.com/forpublicai",
        description: "Open-source repositories, prompts & infrastructure",
        external: true,
      },
      {
        title: "LinkedIn",
        href: "https://www.linkedin.com/company/pubai/posts/",
        description: "Follow announcements & partner highlights",
        external: true,
      },
    ],
  },
];
