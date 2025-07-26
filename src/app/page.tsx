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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold">PublicAI</div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
            onClick={() => router.push('/chat')}
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
              className="w-full h-16 px-6 pr-16 text-lg bg-gray-900 border-gray-700 rounded-xl focus:border-gray-500 focus:ring-1 focus:ring-gray-500 placeholder:text-gray-400"
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-white text-black hover:bg-gray-200 rounded-lg"
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
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white rounded-full px-6 py-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Notification Banner */}
      <div className="border-t border-gray-800 bg-gray-900/50 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            🚀 New updates to PublicAI community initiatives are now available.{" "}
            <span className="text-white hover:underline cursor-pointer">
              Learn more
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}