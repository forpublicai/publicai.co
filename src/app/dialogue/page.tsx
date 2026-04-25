"use client";

import { useState } from "react";
import { LanguageContext } from "@/components/dialogue/LanguageContext";
import SurveyContent from "@/components/dialogue/SurveyContent";
import type { LanguageCode } from "@/lib/languages";

export default function DialoguePage() {
  const [language, setLanguage] = useState<LanguageCode>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen bg-background">
        <SurveyContent />
      </div>
    </LanguageContext.Provider>
  );
}
