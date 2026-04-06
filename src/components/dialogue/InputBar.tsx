"use client";

import { useRef } from "react";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function InputBar({ value, onChange, onSubmit, disabled }: InputBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your thoughts..."
        disabled={disabled}
        className="flex-1 rounded-full border border-border bg-muted px-5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-red-300 focus:ring-1 focus:ring-red-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </form>
  );
}
