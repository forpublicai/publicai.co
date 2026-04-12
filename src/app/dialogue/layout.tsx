"use client";

import { useState } from "react";
import { LanguageContext } from "@/components/dialogue/LanguageContext";
import { useDeliberation } from "@/components/dialogue/useDeliberation";
import DeliberationContent from "@/components/dialogue/DeliberationContent";
import SurveyContent from "@/components/dialogue/SurveyContent";
import type { LanguageCode } from "@/lib/languages";

type Tab = "deliberation" | "survey";

const tabs: { key: Tab; label: string }[] = [
  { key: "deliberation", label: "Deliberation of the Day" },
  { key: "survey", label: "Swiss National AI Dialogue" },
];

export default function DialogueLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [activeTab, setActiveTab] = useState<Tab>("deliberation");
  const deliberationData = useDeliberation();

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-background">
        {/* Nav */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4">
            <nav className="flex items-center gap-6">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Both tabs stay mounted to avoid re-fetching on switch */}
        <div className={activeTab === "deliberation" ? "" : "hidden"}>
          <DeliberationContent deliberationData={deliberationData} />
        </div>
        <div className={activeTab === "survey" ? "" : "hidden"}>
          <SurveyContent deliberationData={deliberationData} />
        </div>
      </div>
    </LanguageContext.Provider>
  );
}
