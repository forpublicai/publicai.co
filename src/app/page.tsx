"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      router.push(`/chat?message=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-normal leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Try Apertus
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 text-center">
            What if AI were public infrastructure like highways, water, or electricity?
          </p>

          {/* Input Field */}
          <div className="relative mb-6">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Tell me about yourself."
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
              onClick={() => setInputValue("What's Apertus?")}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm"
            >
              What's Apertus?
            </Button>
            <Button
              variant="outline"
              onClick={() => setInputValue("Was ist öffentliche KI?")}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm"
            >
              Was ist öffentliche KI?
            </Button>
            <Button
              variant="outline"
              onClick={() => setInputValue("C'est quoi, ce plan secret ultra top secret?")}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm"
            >
              C'est quoi, ce plan secret ultra top secret?
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="px-6 space-y-20">
        {/* With love from Switzerland */}
        <section className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">
                With love, from Switzerland
              </h2>
              <p className="text-gray-600 mb-6">
                Imanol's team just launched Apertus, the most powerful open-source language model ever released by a public institution.
              </p>
              <Link 
                href="/apertus"
                className="inline-block bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium transition-colors"
              >
                Read more
              </Link>
            </div>
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <img 
                src="/switzerland.png" 
                alt="With love, from Switzerland" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Airbus for AI */}
        <section className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <img 
                src="/airbus.jpg" 
                alt="Airbus for AI" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">
                Airbus for AI
              </h2>
              <p className="text-gray-600 mb-6">
                Diane and her co-authors argue for a third way frontier lab for AI—built from existing national labs and national champions.
              </p>
              <Link 
                href="/airbus"
                className="inline-block bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium transition-colors"
              >
                Read more
              </Link>
            </div>
          </div>
        </section>

        {/* Call for Contributions */}
        <section className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">
                It's launched! Now we really need your help.
              </h2>
              <p className="text-gray-600 mb-6">
                Joseph needs your help building the inference service. Just send PRs – it's all open source.
              </p>
            </div>
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <img 
                src="/community.jpeg" 
                alt="Call for contributions – help Joseph!" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-20 mt-20">
          <div className="text-center text-sm text-gray-500 mt-8">
            &copy; 2025, All rights reserved. &nbsp;
            <Link href="/tc" className="hover:text-gray-800">Terms & conditions</Link>
          </div>
      </footer>
    </div>
  );
}