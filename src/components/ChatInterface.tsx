"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      router.push(`/chat?message=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <>
      {/* Input Field */}
      <div className="relative mb-6">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="What's Apertus?"
          className="w-full h-16 px-6 pr-16 text-lg bg-card border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
          disabled={!inputValue.trim()}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Button
          variant="outline"
          onClick={() => setInputValue("What's public AI?")}
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm"
        >
          What&apos;s public AI?
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputValue("Was ist souveräne KI?")}
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm"
        >
          Was ist souveräne KI?
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputValue("C'est quoi, ce plan secret ultra top secret?")}
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm"
        >
          C&apos;est quoi, ce plan secret ultra top secret?
        </Button>
      </div>
    </>
  );
}