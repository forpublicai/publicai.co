"use client";

import { LANGUAGES, type LanguageCode } from "@/lib/languages";

interface LanguageToggleProps {
  value: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

export default function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted p-0.5 text-xs font-medium">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            value === lang.code
              ? "bg-red-500 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
