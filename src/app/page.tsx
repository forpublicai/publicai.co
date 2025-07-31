"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Navigate to chat with the message as a query parameter
      router.push(`/chat?message=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const suggestionButtons = [
    "Contribute Models",
    "Share Datasets", 
    "Research",
    "Community",
    "More"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logo-large.png" alt="PublicAI" className="h-8" />
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-transparent border-border text-foreground hover:bg-muted"
            onClick={() => router.push('/chat')}
          >
            Try Demo
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => window.open('https://app.publicai.company', '_blank')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-normal leading-tight">
            Ask not what the public can do for you — ask what you can do for the public
          </h1>

          {/* Input Field */}
          <div className="max-w-2xl mx-auto relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="How will you shape public AI?"
              className="w-full h-16 px-6 pr-16 text-lg bg-card border-border rounded-xl focus:border-ring focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              disabled={!inputValue.trim()}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggestion Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {suggestionButtons.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-full px-6 py-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Notification Banner */}
      <div className="border-t border-border bg-muted/50 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            🚀 New updates to PublicAI community initiatives are now available.{" "}
            <span className="text-foreground hover:underline cursor-pointer">
              Learn more
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}