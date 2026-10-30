import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  AudioWaveform,
  Clock,
  Code2,
  Cpu,
  Eye,
  FileJson,
  Info,
  Layers,
  Mic,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ProductPageTemplate,
  WaitlistForm,
  type CardGridItem,
  type ProductCodeTab,
  type ProductHashSubsection,
} from "@/components/sections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Inference, Vision, Batch & Voice API — PublicAI Developer Platform",
  description:
    "Unified OpenAI- and Anthropic-compatible API gateway (https://api.publicai.co/v1) for sovereign text & multimodal vision LLMs, plus asynchronous Batch API (4h & 24h SLA) and Voice API (Whisper + NVIDIA PersonaPlex).",
  alternates: {
    canonical: "https://publicai.co/products/api",
  },
};

const API_FEATURES: CardGridItem[] = [
  {
    title: "Drop-In OpenAI & Anthropic Compatibility",
    description:
      "Point your existing OpenAI SDK (/v1/chat/completions, /v1/responses) or Anthropic SDK (/v1/messages) to https://api.publicai.co/v1 and switch models in one line.",
    badge: "OpenAI + Anthropic SDKs",
    badgeVariant: "teal",
    icon: <Code2 className="h-5 w-5" />,
    href: "/docs/api",
    ctaLabel: "OpenAPI Reference",
  },
  {
    title: "Multimodal Vision LLMs (Apertus 1.5)",
    description:
      "Pass base64 or HTTPS image inputs alongside text prompts to vision-capable open-weight models like Swiss AI Apertus 1.5 (70B & 8B) for OCR, chart analysis, and visual QA.",
    badge: "Text + Image Input",
    badgeVariant: "secondary",
    icon: <Eye className="h-5 w-5" />,
    href: "/models",
    ctaLabel: "View Vision Models",
  },
  {
    title: "Federated Sovereign Compute Routing",
    description:
      "Requests automatically route to national supercomputing centers (CSCS Alps, AI Singapore, BSC, AI Sweden) with health-checked failover and transparent provenance.",
    badge: "High Availability",
    badgeVariant: "outline",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    title: "Tool Calling & Structured JSON Outputs",
    description:
      "Full support for multi-turn function calling, JSON schema enforcement, streaming SSE tokens, and reasoning effort controls across supported models.",
    badge: "Agent-Ready",
    badgeVariant: "teal",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Zero Data Retention & Training Guarantee",
    description:
      "API prompts and completions are never logged to train commercial models. Ideal for public-sector agencies, healthcare researchers, and regulated enterprises.",
    badge: "Privacy Guaranteed",
    badgeVariant: "secondary",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Programmatic Pricing & Key Management",
    description:
      "Start with $2.00 in free credits and 100 req/min. Query live per-token pricing via GET /v1/developer/pricing and manage keys at platform.publicai.co.",
    badge: "$2 Free Starter Credit",
    badgeVariant: "outline",
    icon: <Activity className="h-5 w-5" />,
    href: "/pricing",
    ctaLabel: "Compare Plans",
  },
];

const API_CODE_TABS: ProductCodeTab[] = [
  {
    id: "python",
    label: "Python (OpenAI SDK)",
    description:
      "Standard text & multimodal vision completion using the official openai Python client:",
    code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.publicai.co/v1",
    api_key="YOUR_PUBLICAI_API_KEY",
    default_headers={"User-Agent": "MyCivicApp/1.0"}
)

response = client.chat.completions.create(
    model="swiss-ai/apertus-v1.5-70b-instruct",
    messages=[
        {"role": "system", "content": "You are a helpful multilingual assistant."},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Summarize the key findings in this chart:"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://publicai.co/assets/sample-chart.png"}
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)`,
  },
  {
    id: "typescript",
    label: "TypeScript / Node",
    description:
      "Streaming chat completion with SEA-LION v4 or Olmo 3 in TypeScript:",
    code: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.publicai.co/v1",
  apiKey: process.env.PUBLICAI_API_KEY,
  defaultHeaders: { "User-Agent": "MyCivicApp/1.0" },
});

const stream = await client.chat.completions.create({
  model: "aisingapore/Qwen-SEA-LION-v4-32B-IT",
  messages: [{ role: "user", content: "Explain digital public infrastructure in Bahasa Indonesia." }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}`,
  },
  {
    id: "curl",
    label: "cURL (REST)",
    description: "Direct HTTP POST to /v1/chat/completions:",
    code: `curl https://api.publicai.co/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "User-Agent: MyCivicApp/1.0" \\
  -d '{
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [
      {"role": "user", "content": "What is sovereign open-weight AI?"}
    ]
  }'`,
  },
];

const API_SUBSECTIONS: ProductHashSubsection[] = [
  {
    id: "batch",
    badge: "Coming Soon · 50–80% Discount",
    badgeVariant: "amber",
    title: "Asynchronous Batch API",
    accentText: "4h Express & 24h Standard SLA.",
    accentColor: "teal",
    description:
      "Process millions of prompts for corpus translation, benchmark evaluation, and synthetic data generation using spare off-peak supercomputing capacity. Supports both OpenRouter-style inline JSON arrays and the standard OpenAI .jsonl Files + Batches SDK workflow.",
    ctaLabel: "Read Full Batch Spec",
    ctaHref: "/docs/batch",
    features: [
      {
        title: "4-Hour Express SLA (50% Off)",
        description:
          "Same-day batch completion guaranteed within 4 hours at 50% off standard input and output token rates.",
        badge: "4h Turnaround",
        badgeVariant: "teal",
        icon: <Clock className="h-5 w-5" />,
      },
      {
        title: "24-Hour Standard SLA (Up to 80% Off)",
        description:
          "Overnight scheduling on national HPC clusters (such as CSCS Alps) delivering up to 80% cost reduction for massive research runs.",
        badge: "24h Turnaround",
        badgeVariant: "secondary",
        icon: <Layers className="h-5 w-5" />,
      },
      {
        title: "Dual Submission Ergonomics",
        description:
          "Submit up to 10,000 requests inline via a single JSON array POST, or upload multi-gigabyte .jsonl files via /v1/files and /v1/batches.",
        badge: "JSON Array + .jsonl",
        badgeVariant: "outline",
        icon: <FileJson className="h-5 w-5" />,
      },
    ],
    codeTabs: [
      {
        id: "batch-inline",
        label: "Inline JSON Array (OpenRouter Style)",
        code: `curl https://api.publicai.co/v1/batch/inline \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "swiss-ai/apertus-v1.5-70b-instruct",
    "completion_window": "4h",
    "requests": [
      {"custom_id": "doc-1", "messages": [{"role": "user", "content": "Translate to Romansh: Good morning."}]},
      {"custom_id": "doc-2", "messages": [{"role": "user", "content": "Translate to Italian: Public AI utility."}]}
    ]
  }'`,
      },
      {
        id: "batch-jsonl",
        label: "OpenAI SDK (.jsonl Workflow)",
        code: `from openai import OpenAI

client = OpenAI(base_url="https://api.publicai.co/v1", api_key="YOUR_PUBLICAI_API_KEY")

batch_file = client.files.create(
    file=open("eval_prompts.jsonl", "rb"),
    purpose="batch"
)

batch_job = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={"project": "multilingual-civic-eval"}
)
print("Batch ID:", batch_job.id)`,
      },
    ],
    waitlistSlot: (
      <WaitlistForm
        product="api-batch"
        badge="Batch API Early Access"
        title="Reserve Batch Capacity (4h & 24h Windows)"
        description="Sign up for priority access to the PublicAI Batch API for high-volume dataset generation, translation, and academic evaluations."
        buttonLabel="Request Batch Access"
      />
    ),
  },
  {
    id: "voice",
    badge: "Coming Soon · Whisper + PersonaPlex",
    badgeVariant: "amber",
    title: "PublicAI Voice & Speech API",
    accentText: "Single-Duplex & Full-Duplex Speech.",
    accentColor: "red",
    description:
      "Build accessible civic hotlines, library kiosks, and multilingual voice assistants with two complementary tiers: ultra-accurate single-duplex transcription/synthesis via OpenAI-compatible Whisper endpoints, and low-latency full-duplex speech-to-speech powered by NVIDIA PersonaPlex.",
    features: [
      {
        title: "Single-Duplex STT & TTS (Whisper)",
        description:
          "Drop-in /v1/audio/transcriptions and /v1/audio/speech endpoints powered by open-weight Whisper large-v3-turbo and sovereign TTS voices.",
        badge: "Whisper STT / TTS",
        badgeVariant: "teal",
        icon: <Mic className="h-5 w-5" />,
      },
      {
        title: "Full-Duplex Speech-to-Speech (NVIDIA PersonaPlex)",
        description:
          "Real-time, interruptible bidirectional voice conversations over WebSocket/WebRTC powered by NVIDIA PersonaPlex with natural turn-taking and persona control.",
        badge: "NVIDIA PersonaPlex",
        badgeVariant: "secondary",
        icon: <Radio className="h-5 w-5" />,
      },
      {
        title: "Public Kiosk & Accessibility Ready",
        description:
          "Purpose-built for library kiosks, municipal 311 voice agents, and screen-free accessibility across regional accents and languages.",
        badge: "Civic Voice Utility",
        badgeVariant: "outline",
        icon: <AudioWaveform className="h-5 w-5" />,
      },
    ],
    codeTabs: [
      {
        id: "voice-whisper",
        label: "Single-Duplex (Whisper STT)",
        code: `curl https://api.publicai.co/v1/audio/transcriptions \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -F file="@townhall-recording.mp3" \\
  -F model="openai/whisper-large-v3-turbo" \\
  -F response_format="verbose_json"`,
      },
      {
        id: "voice-personaplex",
        label: "Full-Duplex (NVIDIA PersonaPlex)",
        code: `// WebSocket Full-Duplex Speech-to-Speech Session (Preview)
const ws = new WebSocket(
  "wss://api.publicai.co/v1/realtime?model=nvidia/personaplex-voice-v1",
  { headers: { Authorization: \`Bearer \${process.env.PUBLICAI_API_KEY}\` } }
);

ws.on("open", () => {
  ws.send(JSON.stringify({
    type: "session.update",
    session: {
      modalities: ["audio", "text"],
      voice: "civic-neutral",
      turn_detection: { type: "server_vad", interrupt_response: true }
    }
  }));
});`,
      },
    ],
    waitlistSlot: (
      <WaitlistForm
        product="api-voice"
        badge="Voice API Preview Waitlist"
        title="Join the Whisper & NVIDIA PersonaPlex Voice Beta"
        description="Get early API credentials for single-duplex Whisper transcription and full-duplex NVIDIA PersonaPlex real-time voice sessions."
        buttonLabel="Request Voice API Access"
      />
    ),
  },
];

export default function ApiProductPage() {
  return (
    <ProductPageTemplate
      badge="Developer Platform"
      badgeVariant="teal"
      title="Sovereign Inference & Vision API."
      accentText="One Endpoint. Global Public Compute."
      accentColor="teal"
      description="Integrate national open-weight text and multimodal vision LLMs using your existing OpenAI SDK."
      primaryCta={{
        label: "Get API Key",
        href: "https://platform.publicai.co/settings/api-keys",
        external: true,
      }}
      secondaryCta={{
        label: "Explore Developer Docs",
        href: "/docs",
      }}
      heroSlot={
        <div className="mx-auto max-w-3xl text-left">
          <Alert className="rounded-2xl border-border bg-secondary/60">
            <Info className="h-4 w-4 text-[#00B3A4]" />
            <AlertTitle className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span>Supported Modalities & Scope Clarity</span>
              <Badge variant="outline" className="rounded-full text-[10px] font-mono">
                Text + Multimodal Vision Input
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
              The PublicAI Inference API supports <strong>text generation</strong> and{" "}
              <strong>multimodal image-to-text vision inputs</strong> (such as{" "}
              <code className="font-mono text-foreground">swiss-ai/apertus-v1.5-70b-instruct</code>{" "}
              and <code className="font-mono text-foreground">apertus-v1.5-8b</code>) across{" "}
              <code className="font-mono text-foreground">/v1/chat/completions</code>,{" "}
              <code className="font-mono text-foreground">/v1/responses</code>, and{" "}
              <code className="font-mono text-foreground">/v1/messages</code>. We do{" "}
              <strong>not</strong> offer diffusion image generation, video generation, or{" "}
              <code className="font-mono text-foreground">/v1/embeddings</code> endpoints.{" "}
              <Link href="/models" className="font-semibold text-primary underline">
                Browse all supported models →
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      }
      featuresTitle="Enterprise-Grade Reliability on Public Infrastructure"
      featuresSubtitle="Built on a high-throughput API gateway with strict schema validation, zero prompt training, and transparent token billing."
      features={API_FEATURES}
      featuresColumns={3}
      codeSectionTitle="Drop-In SDK Integration in 60 Seconds"
      codeSectionSubtitle="Change base_url to https://api.publicai.co/v1 and pass a User-Agent header to start calling sovereign models."
      codeTabs={API_CODE_TABS}
      subsections={API_SUBSECTIONS}
      bottomBanner={{
        title: "Start building on",
        accentText: "sovereign public compute.",
        subtitle:
          "Generate an API key in seconds with $2.00 in free starter credits and 100 requests per minute.",
        ctaLabel: "Create API Key",
        ctaHref: "https://platform.publicai.co/settings/api-keys",
      }}
    />
  );
}
