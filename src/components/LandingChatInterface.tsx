"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUp, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/components/global";
import { cn } from "@/lib/utils";

const MODELS = [
  {
    id: "swiss-ai/apertus-v1.5-70b-instruct",
    name: "Apertus 1.5 (Swiss AI)",
    badge: "Multimodal",
    placeholder: "Ask Apertus 1.5 in English, German, French, or Italian...",
  },
  {
    id: "aisingapore/Qwen-SEA-LION-v4-32B-IT",
    name: "SEA-LION v4 (AI Singapore)",
    badge: "Southeast Asia",
    placeholder: "Tanya SEA-LION v4 dalam Bahasa Indonesia, Melayu, Thai, Tagalog...",
  },
  {
    id: "allenai/Olmo-3-7B-Instruct",
    name: "OLMo 3 (Allen AI)",
    badge: "100% Open Data",
    placeholder: "Ask OLMo 3 about open science and training datasets...",
  },
  {
    id: "bsc/salamandra-7b-instruct",
    name: "Salamandra (BSC Spain)",
    badge: "Iberian Languages",
    placeholder: "Pregunta a Salamandra en Castellano, Català, Galego, Euskara...",
  },
];

const SUGGESTIONS = [
  {
    prompt: "What is sovereign public AI infrastructure?",
    label: "What is public AI infrastructure?",
  },
  {
    prompt: "Was bedeutet digitale Souveränität für die Schweiz?",
    label: "Souveräne KI (DE)",
  },
  {
    prompt: "Jelaskan konsep infrastruktur kecerdasan buatan publik.",
    label: "Infrastruktur Publik (ID)",
  },
  {
    prompt: "¿Cómo pueden las bibliotecas públicas gobernar la IA?",
    label: "Bibliotecas e IA (ES)",
  },
];

export default function LandingChatInterface() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim();
    if (!text) return;
    trackEvent("landing_demo_prompt_submitted", {
      model_id: selectedModel.id,
      model_name: selectedModel.name,
      prompt_length: text.length,
    });
    router.push(
      `/chat?message=${encodeURIComponent(text)}`
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Model Selection Selector Pills */}
      {/*<div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl border border-border bg-secondary/50">*/}
      {/*  {MODELS.map((model) => (*/}
      {/*    <button*/}
      {/*      key={model.id}*/}
      {/*      type="button"*/}
      {/*      onClick={() => {*/}
      {/*        setSelectedModel(model);*/}
      {/*        trackEvent("landing_demo_model_selected", {*/}
      {/*          model_id: model.id,*/}
      {/*          model_name: model.name,*/}
      {/*        });*/}
      {/*      }}*/}
      {/*      className={cn(*/}
      {/*        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer",*/}
      {/*        selectedModel.id === model.id*/}
      {/*          ? "bg-card text-foreground shadow-xs border border-border font-semibold"*/}
      {/*          : "text-muted-foreground hover:text-foreground"*/}
      {/*      )}*/}
      {/*    >*/}
      {/*      <span>{model.name}</span>*/}
      {/*      <Badge*/}
      {/*        variant="outline"*/}
      {/*        className={cn(*/}
      {/*          "text-[10px] py-0 px-1.5 rounded-full border-border/80",*/}
      {/*          selectedModel.id === model.id && "bg-secondary text-primary"*/}
      {/*        )}*/}
      {/*      >*/}
      {/*        {model.badge}*/}
      {/*      </Badge>*/}
      {/*    </button>*/}
      {/*  ))}*/}
      {/*</div>*/}

      {/* Main Prompt Bar */}
      <div className="relative w-full shadow-lg rounded-2xl overflow-hidden border border-border/90 bg-card">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={selectedModel.placeholder}
          className="w-full h-16 sm:h-18 px-5 pr-16 text-sm sm:text-base bg-card border-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground/70"
        />
        <Button
          size="sm"
          onClick={() => handleSubmit()}
          disabled={!inputValue.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs disabled:opacity-40"
          aria-label="Send prompt"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#00B3A4]" />
          Try:
        </span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleSubmit(item.prompt)}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile App Teaser Pill */}
      <div className="pt-2">
        <Link
          href="/products/chat#mobile"
          className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 hover:bg-secondary px-3.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Smartphone className="h-3.5 w-3.5 text-primary" />
          <span>
            <strong>Public AI Mobile App</strong> coming soon to iOS &amp; Android
          </span>
          <ArrowRight className="h-3 w-3 text-primary" />
        </Link>
      </div>
    </div>
  );
}
