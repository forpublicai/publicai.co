"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-normal text-black mb-8 leading-tight text-center">
            Try Apertus
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 text-center">
            ⛰️
          </p>

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
                Imanol&apos;s team just launched Apertus, the most powerful open-source language model ever released by a public institution.
              </p>
              <Link 
                href="/apertus"
                className="inline-block bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium transition-colors"
              >
                Read more
              </Link>
            </div>
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <Image 
                src="/switzerland.png" 
                alt="With love, from Switzerland" 
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Hugging Face Partnership */}
        <section className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">
                🤗📡🤝
              </h2>
              <p className="text-gray-600 mb-6">
                Julien and Simon&apos;s team just helped us launch as an official inference provider on Hugging Face!
              </p>
                <Link 
                href="/huggingface"
                className="inline-block bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium transition-colors"
              >
                Read more
              </Link>
            </div>
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <Image 
                src="/people/nanobanana_julien_simon.png" 
                alt="With love, from Switzerland" 
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Airbus for AI */}
        <section className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <Image 
                src="/airbus.jpg" 
                alt="Airbus for AI" 
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">
                An Airbus for AI
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
                It&apos;s launched! Now we really need your help.
              </h2>
              <p className="text-gray-600 mb-6">
                Joseph needs your help building the inference service. Just send PRs – it&apos;s all open source.
              </p>
              <Link 
                href="/contributing"
                className="inline-block bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium transition-colors"
              >
                Read more
              </Link>
            </div>
            <div className="bg-pink-100 rounded-lg aspect-square overflow-hidden">
              <Image 
                src="/community.jpeg" 
                alt="Call for contributions – help Joseph!" 
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

      </div>

      {/* Partners Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-16 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Partners</h2>
          <p className="text-gray-600">Powered by models and compute from leading institutions and organizations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 items-center justify-center justify-items-center">
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.swiss-ai.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/swissai.png" 
                alt="Swiss AI" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/aws.png" 
                alt="Amazon Web Services" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.exoscale.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/exoscale.png" 
                alt="Exoscale" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.aisingapore.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/aisingapore.png" 
                alt="AI Singapore" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.cudocompute.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/cudo.png" 
                alt="Cudo Compute"
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.cscs.ch" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/cscs.jpg" 
                alt="Swiss National Supercomputing Centre" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://nci.org.au" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/nciaustralia.png" 
                alt="National Computational Infrastructure Australia" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.fz-juelich.de/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/juelich.png" 
                alt="Juelich Supercomputing Center" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
        </div>
      </section>

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