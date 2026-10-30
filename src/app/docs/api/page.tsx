import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  FileJson,
  KeyRound,
  Lock,
  Server,
} from "lucide-react";
import { getDocsMeta, getOpenApiSpec } from "@/lib/content";
import { SidebarContentLayout, type TocHeadingItem } from "@/components/sections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "OpenAPI 3.1 Reference — PublicAI Developer Documentation",
  description:
    "Complete OpenAPI 3.1 endpoint and schema reference for the Public AI Gateway (https://api.publicai.co/v1), including /v1/models, /v1/chat/completions, /v1/responses, and /v1/messages.",
  alternates: {
    canonical: "https://publicai.co/docs/api",
  },
};

interface OpenApiProperty {
  type?: string;
  description?: string;
  default?: unknown;
  example?: unknown;
  enum?: string[];
  $ref?: string;
}

interface OpenApiSchema {
  type?: string;
  description?: string;
  properties?: Record<string, OpenApiProperty>;
  required?: string[];
  example?: unknown;
}

interface OpenApiOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  "x-internal"?: boolean;
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    example?: string;
    schema?: { type?: string };
  }>;
  requestBody?: {
    required?: boolean;
    content?: {
      "application/json"?: {
        schema?: { $ref?: string };
      };
    };
  };
  responses?: Record<
    string,
    {
      description?: string;
      content?: {
        "application/json"?: {
          schema?: { $ref?: string };
          example?: unknown;
        };
      };
    }
  >;
}

function getEndpointExamples(method: string, routePath: string) {
  const upper = method.toUpperCase();
  if (routePath === "/v1/models") {
    return {
      curl: `curl -X GET https://api.publicai.co/v1/models \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "User-Agent: MyApp/1.0"`,
      python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.publicai.co/v1",
    api_key="YOUR_PUBLICAI_API_KEY",
    default_headers={"User-Agent": "MyApp/1.0"},
)

models = client.models.list()
for m in models.data:
    print(m.id, getattr(m, "context_length", None))`,
      typescript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.publicai.co/v1",
  apiKey: process.env.PUBLICAI_API_KEY,
  defaultHeaders: { "User-Agent": "MyApp/1.0" },
});

const list = await client.models.list();
console.log(list.data.map((m) => m.id));`,
    };
  }

  if (routePath === "/v1/chat/completions") {
    return {
      curl: `curl -X POST https://api.publicai.co/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "User-Agent: MyApp/1.0" \\
  -d '{
    "model": "swiss-ai/apertus-v1.5-8b",
    "messages": [
      { "role": "user", "content": "Explain sovereign AI in two sentences." }
    ],
    "temperature": 0.7
  }'`,
      python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.publicai.co/v1",
    api_key="YOUR_PUBLICAI_API_KEY",
    default_headers={"User-Agent": "MyApp/1.0"},
)

completion = client.chat.completions.create(
    model="swiss-ai/apertus-v1.5-8b",
    messages=[
        {"role": "user", "content": "Explain sovereign AI in two sentences."}
    ],
)
print(completion.choices[0].message.content)`,
      typescript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.publicai.co/v1",
  apiKey: process.env.PUBLICAI_API_KEY,
  defaultHeaders: { "User-Agent": "MyApp/1.0" },
});

const res = await client.chat.completions.create({
  model: "swiss-ai/apertus-v1.5-8b",
  messages: [{ role: "user", content: "Explain sovereign AI in two sentences." }],
});
console.log(res.choices[0]?.message?.content);`,
    };
  }

  if (routePath === "/v1/responses") {
    return {
      curl: `curl -X POST https://api.publicai.co/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "User-Agent: MyApp/1.0" \\
  -d '{
    "model": "swiss-ai/apertus-v1.5-70b-instruct",
    "input": "Summarize the goals of public digital infrastructure."
  }'`,
      python: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.publicai.co/v1",
    api_key="YOUR_PUBLICAI_API_KEY",
    default_headers={"User-Agent": "MyApp/1.0"},
)

res = client.responses.create(
    model="swiss-ai/apertus-v1.5-70b-instruct",
    input="Summarize the goals of public digital infrastructure.",
)
print(res.output_text)`,
      typescript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.publicai.co/v1",
  apiKey: process.env.PUBLICAI_API_KEY,
  defaultHeaders: { "User-Agent": "MyApp/1.0" },
});

const res = await client.responses.create({
  model: "swiss-ai/apertus-v1.5-70b-instruct",
  input: "Summarize the goals of public digital infrastructure.",
});
console.log(res.output_text);`,
    };
  }

  if (routePath === "/v1/messages") {
    return {
      curl: `curl -X POST https://api.publicai.co/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $PUBLICAI_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "User-Agent: MyApp/1.0" \\
  -d '{
    "model": "swiss-ai/apertus-v1.5-70b-instruct",
    "max_tokens": 1024,
    "messages": [
      { "role": "user", "content": "Hello from the Anthropic Messages API!" }
    ]
  }'`,
      python: `import anthropic

client = anthropic.Anthropic(
    base_url="https://api.publicai.co",
    api_key="YOUR_PUBLICAI_API_KEY",
    default_headers={"User-Agent": "MyApp/1.0"},
)

message = client.messages.create(
    model="swiss-ai/apertus-v1.5-70b-instruct",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello from Anthropic SDK!"}],
)
print(message.content[0].text)`,
      typescript: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.publicai.co",
  apiKey: process.env.PUBLICAI_API_KEY,
  defaultHeaders: { "User-Agent": "MyApp/1.0" },
});

const msg = await client.messages.create({
  model: "swiss-ai/apertus-v1.5-70b-instruct",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello from Anthropic SDK!" }],
});
console.log(msg.content);`,
    };
  }

  return {
    curl: `curl -X ${upper} https://api.publicai.co${routePath} \\
  -H "Authorization: Bearer $PUBLICAI_API_KEY" \\
  -H "User-Agent: MyApp/1.0" \\
  -H "Content-Type: application/json"`,
    python: `import httpx

res = httpx.request(
    "${upper}",
    "https://api.publicai.co${routePath}",
    headers={
        "Authorization": "Bearer YOUR_PUBLICAI_API_KEY",
        "User-Agent": "MyApp/1.0",
    },
)
print(res.status_code, res.json())`,
    typescript: `const res = await fetch("https://api.publicai.co${routePath}", {
  method: "${upper}",
  headers: {
    Authorization: \`Bearer \${process.env.PUBLICAI_API_KEY}\`,
    "User-Agent": "MyApp/1.0",
    "Content-Type": "application/json",
  },
});
console.log(await res.json());`,
  };
}

export default function OpenApiReferencePage() {
  const docsMeta = getDocsMeta("/docs/api");
  const spec = getOpenApiSpec() as {
    openapi?: string;
    info?: { title?: string; version?: string };
    servers?: Array<{ url: string }>;
    paths?: Record<string, Record<string, unknown>>;
    components?: { schemas?: Record<string, OpenApiSchema> };
  };

  const schemas = spec.components?.schemas ?? {};
  const rawPaths = spec.paths ?? {};

  // Extract public endpoints (filter out /deprecated/* or x-internal: true)
  const endpoints: Array<{
    id: string;
    method: string;
    path: string;
    operation: OpenApiOperation;
  }> = [];

  for (const [routePath, pathObj] of Object.entries(rawPaths)) {
    if (routePath.startsWith("/deprecated")) continue;
    for (const method of ["get", "post", "put", "delete", "patch"]) {
      const op = pathObj[method] as OpenApiOperation | undefined;
      if (!op || op["x-internal"] === true) continue;
      const id = `${method}-${routePath.replace(/[^a-zA-Z0-9]+/g, "-")}`.replace(
        /-+/g,
        "-"
      );
      endpoints.push({ id, method: method.toUpperCase(), path: routePath, operation: op });
    }
  }

  const tocItems: TocHeadingItem[] = [
    { id: "authentication-servers", title: "Base URL & Authentication", level: 2 },
    ...endpoints.map((ep) => ({
      id: ep.id,
      title: `${ep.method} ${ep.path}`,
      level: 2 as const,
    })),
    { id: "component-schemas", title: "Component Schemas", level: 2 },
  ];

  const resolveSchemaRef = (ref?: string): { name: string; schema: OpenApiSchema } | null => {
    if (!ref || !ref.startsWith("#/components/schemas/")) return null;
    const name = ref.replace("#/components/schemas/", "");
    const schema = schemas[name];
    return schema ? { name, schema } : null;
  };

  return (
    <SidebarContentLayout
      portalTitle={docsMeta.portalTitle}
      portalSubtitle={docsMeta.portalSubtitle}
      sections={docsMeta.sections}
      breadcrumbs={[
        { label: "Docs", href: "/docs" },
        { label: "OpenAPI Reference" },
      ]}
      tocItems={tocItems}
      headerSlot={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
            <Link
              href="https://platform.publicai.co/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              <KeyRound className="mr-1.5 h-3.5 w-3.5" />
              API Keys
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full text-xs">
            <Link
              href="https://platform.publicai.co/account/billing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Billing 
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* Page Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-[#00B3A4]/15 text-[#00B3A4] border-[#00B3A4]/30 font-mono text-xs">
              OpenAPI {spec.openapi ?? "3.1.0"}
            </Badge>
            <Badge variant="outline" className="rounded-full font-mono text-xs">
              v{spec.info?.version ?? "1.0.0"}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {spec.info?.title ?? "Public AI Gateway API"} Reference
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
            Complete HTTP endpoint specification for the PublicAI Inference Gateway. Compatible with official OpenAI and Anthropic SDKs, supporting synchronous and streaming chat completions, multimodal vision inputs, and programmatic model pricing.
          </p>
        </div>

        {/* Base URL & Authentication Card */}
        <section id="authentication-servers" className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">
            Base URL & Authentication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl border-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Server className="h-4 w-4 text-[#00B3A4]" />
                  Production Gateway Server
                </CardTitle>
                <CardDescription className="text-xs">
                  Global load-balanced sovereign inference endpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-3.5 py-2 font-mono text-xs">
                  <span>https://api.publicai.co/v1</span>
                  <CopyButton text="https://api.publicai.co/v1" className="h-6 w-6" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Pass this URL as <code className="font-mono">base_url</code> in the OpenAI SDK or <code className="font-mono">https://api.publicai.co</code> in the Anthropic SDK.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Required Request Headers
                </CardTitle>
                <CardDescription className="text-xs">
                  Bearer API Key + Application User-Agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 font-mono text-xs">
                <div className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2 space-y-1">
                  <div className="text-foreground">
                    Authorization: Bearer YOUR_PUBLICAI_API_KEY
                  </div>
                  <div className="text-muted-foreground">
                    User-Agent: MyApp/1.0
                  </div>
                </div>
                <p className="font-sans text-xs text-muted-foreground">
                  Manage keys at{" "}
                  <a
                    href="https://platform.publicai.co/settings/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline"
                  >
                    platform.publicai.co/settings/api-keys
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Endpoints List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Endpoints</h2>
            <span className="text-xs font-mono text-muted-foreground">
              {endpoints.length} Public Operations
            </span>
          </div>

          {endpoints.map(({ id, method, path: routePath, operation }) => {
            const reqSchemaRef =
              operation.requestBody?.content?.["application/json"]?.schema?.$ref;
            const resolvedReq = resolveSchemaRef(reqSchemaRef);

            const res200 = operation.responses?.["200"];
            const resSchemaRef =
              res200?.content?.["application/json"]?.schema?.$ref;
            const resolvedRes = resolveSchemaRef(resSchemaRef);
            const resExample =
              res200?.content?.["application/json"]?.example ??
              resolvedRes?.schema.example;

            const examples = getEndpointExamples(method, routePath);

            return (
              <Card
                key={id}
                id={id}
                className="scroll-mt-24 rounded-2xl border-border/90 overflow-hidden shadow-sm"
              >
                <CardHeader className="border-b border-border bg-secondary/30 px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          "rounded-md px-2.5 py-1 font-mono text-xs font-bold uppercase",
                          method === "GET"
                            ? "bg-[#00B3A4] text-white border-transparent"
                            : "bg-primary text-primary-foreground border-transparent"
                        )}
                      >
                        {method}
                      </Badge>
                      <code className="font-mono text-base sm:text-lg font-bold text-foreground">
                        {routePath}
                      </code>
                    </div>
                    <CopyButton
                      text={`https://api.publicai.co${routePath}`}
                      className="h-8 w-8"
                    />
                  </div>
                  {operation.summary && (
                    <CardTitle className="text-base font-semibold pt-2">
                      {operation.summary}
                    </CardTitle>
                  )}
                  {operation.description && (
                    <CardDescription className="text-xs sm:text-sm leading-relaxed">
                      {operation.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Code Examples Tabs */}
                  <div className="theme-navy rounded-xl border border-border/40 bg-background text-foreground overflow-hidden">
                    <Tabs defaultValue="curl" className="w-full">
                      <div className="flex items-center justify-between border-b border-white/10 bg-black/25 px-4 py-2.5">
                        <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-[#38BDF8]" />
                          Request Example
                        </span>
                        <TabsList className="bg-white/10 text-white h-7">
                          <TabsTrigger
                            value="curl"
                            className="text-xs px-2.5 py-0.5 data-[state=active]:bg-primary data-[state=active]:text-white"
                          >
                            cURL
                          </TabsTrigger>
                          <TabsTrigger
                            value="python"
                            className="text-xs px-2.5 py-0.5 data-[state=active]:bg-primary data-[state=active]:text-white"
                          >
                            Python
                          </TabsTrigger>
                          <TabsTrigger
                            value="typescript"
                            className="text-xs px-2.5 py-0.5 data-[state=active]:bg-primary data-[state=active]:text-white"
                          >
                            TypeScript
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      {(["curl", "python", "typescript"] as const).map((lang) => (
                        <TabsContent key={lang} value={lang} className="m-0">
                          <div className="relative p-4 font-mono text-xs text-slate-100 overflow-x-auto bg-black/40">
                            <CopyButton
                              text={examples[lang]}
                              className="absolute right-3 top-3 bg-white/10 hover:bg-white/20"
                            />
                            <pre className="pr-10 leading-relaxed">
                              <code>{examples[lang]}</code>
                            </pre>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>

                  {/* Accordion for Headers, Request Schema, Response Schema */}
                  <Accordion type="multiple" className="w-full">
                    {operation.parameters && operation.parameters.length > 0 && (
                      <AccordionItem value="headers">
                        <AccordionTrigger className="text-sm font-semibold">
                          Headers & Parameters ({operation.parameters.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="divide-y divide-border rounded-xl border border-border">
                            {operation.parameters.map((param) => (
                              <div
                                key={param.name}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <code className="font-mono font-bold text-foreground">
                                      {param.name}
                                    </code>
                                    <Badge variant="outline" className="text-[10px]">
                                      {param.in}
                                    </Badge>
                                    {param.required && (
                                      <Badge className="bg-primary/15 text-primary border-transparent text-[10px]">
                                        required
                                      </Badge>
                                    )}
                                  </div>
                                  {param.description && (
                                    <p className="text-muted-foreground">
                                      {param.description}
                                    </p>
                                  )}
                                </div>
                                {param.example && (
                                  <code className="rounded bg-secondary px-2 py-1 font-mono text-[11px]">
                                    Example: {param.example}
                                  </code>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {resolvedReq && resolvedReq.schema.properties && (
                      <AccordionItem value="request-body">
                        <AccordionTrigger className="text-sm font-semibold">
                          Request Body Schema ({resolvedReq.name})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="divide-y divide-border rounded-xl border border-border">
                            {Object.entries(resolvedReq.schema.properties).map(
                              ([propName, propDef]) => {
                                const isReq =
                                  resolvedReq.schema.required?.includes(propName);
                                return (
                                  <div key={propName} className="p-3.5 text-xs space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <code className="font-mono font-bold text-foreground">
                                        {propName}
                                      </code>
                                      {propDef.type && (
                                        <Badge
                                          variant="secondary"
                                          className="font-mono text-[10px]"
                                        >
                                          {propDef.type}
                                        </Badge>
                                      )}
                                      {isReq && (
                                        <Badge className="bg-primary/15 text-primary border-transparent text-[10px]">
                                          required
                                        </Badge>
                                      )}
                                    </div>
                                    {propDef.description && (
                                      <p className="text-muted-foreground leading-relaxed">
                                        {propDef.description}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {resExample !== undefined && (
                      <AccordionItem value="response-example">
                        <AccordionTrigger className="text-sm font-semibold">
                          200 OK Response Example
                          {resolvedRes ? ` (${resolvedRes.name})` : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="relative rounded-xl border border-border bg-secondary/50 p-4 font-mono text-xs overflow-x-auto">
                            <CopyButton
                              text={JSON.stringify(resExample, null, 2)}
                              className="absolute right-3 top-3"
                            />
                            <pre className="pr-10 leading-relaxed">
                              <code>{JSON.stringify(resExample, null, 2)}</code>
                            </pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Component Schemas Section */}
        <section id="component-schemas" className="scroll-mt-24 space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-[#00B3A4]" />
            <h2 className="text-2xl font-bold tracking-tight">
              OpenAPI Component Schemas
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Data models defined in <code className="font-mono">content/docs/routes.oas.json</code>.
          </p>
          <Accordion type="single" collapsible className="w-full rounded-2xl border border-border px-4">
            {Object.entries(schemas).map(([schemaName, schemaDef]) => (
              <AccordionItem key={schemaName} value={schemaName}>
                <AccordionTrigger className="font-mono text-sm font-semibold">
                  {schemaName}
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {schemaDef.properties && (
                    <div className="divide-y divide-border rounded-xl border border-border">
                      {Object.entries(schemaDef.properties).map(([prop, def]) => (
                        <div key={prop} className="p-3 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold">{prop}</code>
                            {def.type && (
                              <Badge variant="outline" className="font-mono text-[10px]">
                                {def.type}
                              </Badge>
                            )}
                            {schemaDef.required?.includes(prop) && (
                              <Badge className="bg-primary/15 text-primary border-transparent text-[10px]">
                                required
                              </Badge>
                            )}
                          </div>
                          {def.description && (
                            <p className="text-muted-foreground">{def.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Bottom Navigation to Batch API & Models */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/docs/plans">← Plans & Rate Limits</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/docs/batch">
              Batch API Quickstart
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SidebarContentLayout>
  );
}
