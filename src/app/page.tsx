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
            AI should work for everyone, not just Big Tech
          </h1>

          {/* Input Field */}
          <div className="max-w-2xl mx-auto relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="What AI tools would help your community most?"
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

      {/* New Content Sections */}
      <div className="bg-background px-6 py-20 space-y-20">
        {/* Section 1: The Problem */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal">
            AI is too important to be controlled by a few tech giants
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <ul className="text-lg text-muted-foreground space-y-3 text-left">
              <li>• A handful of Big Tech companies control AI development</li>
              <li>• No public accountability in their decision-making</li>
              <li>• Barriers prevent most people and organizations from accessing or building AI</li>
              <li>• The public is locked out of shaping technology that affects everyone</li>
            </ul>
          </div>
        </section>

        {/* Section 2: What is Public AI? */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal">
            AI infrastructure built for the common good
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-muted-foreground">
              Public AI has three core principles:
            </p>
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Public Access</h3>
                <p className="text-muted-foreground">Essential AI capabilities available to everyone, free or at-cost</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Public Accountability</h3>
                <p className="text-muted-foreground">The public has ultimate control over development and direction</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Permanent Public Goods</h3>
                <p className="text-muted-foreground">Sustainably funded infrastructure that can't be captured by private interests</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why This Matters Now */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal">
            We're at a crossroads
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <ul className="text-lg text-muted-foreground space-y-3 text-left">
              <li>• The AI landscape is consolidating rapidly under a few major players</li>
              <li>• History shows public infrastructure drives the greatest progress - from the internet to GPS to public libraries</li>
              <li>• This is our moment to build AI infrastructure before private business models lock us out</li>
              <li>• Once consolidated, it becomes much harder to create public alternatives</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Public AI is Already Happening */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal">
            Real examples around the world
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Singapore</h3>
                <p className="text-muted-foreground">Building SEA-LION models for Southeast Asian languages underserved by commercial AI</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Switzerland</h3>
                <p className="text-muted-foreground">Using supercomputing for AI models focused on science, education, and sustainability</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">United States</h3>
                <p className="text-muted-foreground">NAIRR pilot providing researchers access to AI compute and datasets</p>
              </div>
              <div>
                <p className="text-lg text-muted-foreground mt-6">
                  These projects show public AI can deliver real benefits markets ignore
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Three Ways Forward */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal">
            How we build Public AI
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Public Infrastructure</h3>
                <p className="text-muted-foreground">Shared compute, datasets, and models anyone can build upon</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Public Alternatives</h3>
                <p className="text-muted-foreground">Complete alternatives to ChatGPT and Claude owned by the public</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Solving Real Problems</h3>
                <p className="text-muted-foreground">AI tackling challenges markets ignore - public health, education access, climate solutions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Get Involved */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal">
            Join the movement
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-muted-foreground">
              Public AI needs supporters from every background:
            </p>
            <div className="space-y-4 text-left">
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Researchers & Developers</h3>
                <p className="text-muted-foreground">Contribute to open models and use public compute resources</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Organizations</h3>
                <p className="text-muted-foreground">Choose public AI options when available</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Policymakers</h3>
                <p className="text-muted-foreground">Support legislation for public AI infrastructure investment</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">Everyone</h3>
                <p className="text-muted-foreground">Advocate for AI that serves the public interest</p>
              </div>
            </div>
          </div>
        </section>
      </div>

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