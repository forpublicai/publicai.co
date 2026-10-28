import type { Metadata } from "next";
import {
  Bot,
  Cpu,
  FileSearch,
  GitBranch,
  Lock,
  Workflow,
} from "lucide-react";
import {
  ProductPageTemplate,
  WaitlistForm,
  type CardGridItem,
  type ProductCodeTab,
} from "@/components/sections";

export const metadata: Metadata = {
  title: "Hermes Agentic Service — Sovereign Open-Weight AI Agents | PublicAI",
  description:
    "Deploy auditable, open-weight autonomous agents with MCP tool orchestration, sandboxed execution, and sovereign compute guarantees via the PublicAI Hermes Agentic Service.",
  alternates: {
    canonical: "https://publicai.co/products/agents",
  },
};

const AGENTS_FEATURES: CardGridItem[] = [
  {
    title: "Multi-Step Reasoning & Tool Orchestration",
    description:
      "Powered by sovereign tool-use models (Apertus 1.5 70B, Qwen3-235B Thinking, and Olmo 3) capable of planning, executing, and verifying complex multi-step workflows.",
    badge: "Autonomous Planning",
    badgeVariant: "teal",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "Native Model Context Protocol (MCP) Host",
    description:
      "Connect Hermes agents directly to standardized MCP servers for municipal databases, institutional document repositories, and scientific tools.",
    badge: "MCP Compatible",
    badgeVariant: "secondary",
    icon: <Workflow className="h-5 w-5" />,
  },
  {
    title: "Auditable Execution Traces",
    description:
      "Every reasoning step, tool invocation, and citation is recorded in an immutable, human-auditable trace log—essential for public-sector accountability.",
    badge: "Full Provenance",
    badgeVariant: "outline",
    icon: <FileSearch className="h-5 w-5" />,
  },
  {
    title: "Ephemeral Sovereign Sandboxes",
    description:
      "Run code execution, data analysis, and browser automation inside isolated, zero-retention microVMs hosted on trusted public compute clusters.",
    badge: "Isolated Compute",
    badgeVariant: "teal",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    title: "Human-in-the-Loop Approval Gates",
    description:
      "Configure declarative policy gates requiring human steward sign-off before an agent can mutate external state or send official communications.",
    badge: "Safety Controls",
    badgeVariant: "secondary",
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    title: "OpenAI Responses & Assistants API Compatible",
    description:
      "Orchestrate stateful agent runs using familiar /v1/responses primitives combined with PublicAI sovereign model routing.",
    badge: "/v1/responses",
    badgeVariant: "outline",
    icon: <Cpu className="h-5 w-5" />,
    href: "/docs/api",
    ctaLabel: "View /v1/responses Spec",
  },
];

const AGENTS_CODE_TABS: ProductCodeTab[] = [
  {
    id: "hermes-sdk",
    label: "Python (/v1/responses + Tools)",
    description:
      "Invoke stateful tool-calling workflows using the OpenAI-compatible /v1/responses endpoint:",
    code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.publicai.co/v1",
    api_key="YOUR_PUBLICAI_API_KEY",
    default_headers={"User-Agent": "HermesAgentClient/1.0"}
)

response = client.responses.create(
    model="swiss-ai/apertus-v1.5-70b-instruct",
    input="Cross-reference the 2026 municipal transit budget with open procurement tenders.",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "query_municipal_ledger",
                "description": "Search public procurement and budget records by fiscal year",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "fiscal_year": {"type": "integer"},
                        "department": {"type": "string"}
                    },
                    "required": ["fiscal_year"]
                }
            }
        }
    ]
)

print(response.output_text)`,
  },
];

export default function AgentsProductPage() {
  return (
    <ProductPageTemplate
      badge="Coming Soon · Hermes Agentic Service"
      badgeVariant="amber"
      title="Hermes Agentic Service."
      accentText="Auditable Autonomous Agents on Public Compute."
      accentColor="teal"
      description="Move beyond single-turn chat. Build, sandbox, and govern multi-step AI agents powered by open-weight reasoning models, Model Context Protocol (MCP) connectors, and transparent execution traces."
      primaryCta={{
        label: "Join Hermes Preview Waitlist",
        href: "#waitlist",
      }}
      secondaryCta={{
        label: "Explore /v1/responses API",
        href: "/docs/api",
      }}
      featuresTitle="Designed for Accountable Institutional Automation"
      featuresSubtitle="Unlike opaque black-box agent platforms, Hermes gives public institutions, researchers, and developers full visibility into every tool call and reasoning token."
      features={AGENTS_FEATURES}
      featuresColumns={3}
      codeSectionTitle="Built on Open Standards (/v1/responses & MCP)"
      codeSectionSubtitle="Start building tool-calling agents today on /v1/chat/completions and /v1/responses, and upgrade seamlessly to managed Hermes sandboxes."
      codeTabs={AGENTS_CODE_TABS}
      waitlistSlot={
        <div id="waitlist" className="scroll-mt-28">
          <WaitlistForm
            product="agents-hermes"
            badge="Hermes Early Access"
            title="Join the Hermes Agentic Service Design Partner Program"
            description="Sign up to receive early sandbox credentials and collaborate with our engineering team on sovereign MCP agent workflows."
            buttonLabel="Request Hermes Access"
          />
        </div>
      }
      bottomBanner={{
        title: "Need tool-calling",
        accentText: "inference today?",
        subtitle:
          "Our synchronous /v1/chat/completions and /v1/responses endpoints already support function calling across Apertus 1.5, SEA-LION v4, and Qwen3.",
        ctaLabel: "Read API Reference",
        ctaHref: "/docs/api",
      }}
    />
  );
}
