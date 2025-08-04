"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, AlertTriangle, Network, GitBranch, Globe, Building, Users } from "lucide-react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Navigate to chat with the message as a query parameter
      router.push(`/chat?message=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const suggestionTexts: { [key: string]: string } = {
      "Contribute Models": "How can I contribute to open-source AI models for public benefit?",
      "Share Datasets": "What datasets could help build AI that serves underrepresented communities?",
      "Research": "What research is needed to make AI more accessible and accountable?",
      "Community": "How can local communities benefit from public AI infrastructure?",
      "More": "What are other ways to support the public AI movement?"
    };
    setInputValue(suggestionTexts[suggestion] || suggestion);
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
          <h1 className="text-4xl md:text-6xl font-normal leading-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
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
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105 transition-all duration-200 rounded-full px-6 py-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* New Content Sections */}
      <div className="bg-background px-6 py-32 space-y-32">
        {/* Section 1: The Problem */}
        <section className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <h2 className="text-4xl md:text-5xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              AI is too important to be controlled by a few tech giants
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <ol className="text-lg text-muted-foreground space-y-4 text-left">
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span>A handful of Big Tech companies control AI development</span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span>No public accountability in their decision-making</span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span>Barriers prevent most people and organizations from accessing or building AI</span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</span>
                <span>The public is locked out of shaping technology that affects everyone</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Section 2: What is Public AI? */}
        <section className="bg-muted/30 -mx-6 px-6 py-20">
          <div className="max-w-6xl mx-auto text-left space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <Network className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl md:text-5xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                AI infrastructure built for the common good
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Public AI has three core principles:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg border-l-4 border-blue-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Public Access</h3>
                <p className="text-muted-foreground">Essential AI capabilities available to everyone, free or at-cost</p>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-green-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Public Accountability</h3>
                <p className="text-muted-foreground">The public has ultimate control over development and direction</p>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Permanent Public Goods</h3>
                <p className="text-muted-foreground">Sustainably funded infrastructure that can't be captured by private interests</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why This Matters Now */}
        <section className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GitBranch className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl md:text-5xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              We're at a crossroads
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <ul className="text-lg text-muted-foreground space-y-4 text-left">
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></span>
                <span>The AI landscape is consolidating rapidly under a few major players</span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></span>
                <span>History shows public infrastructure drives the greatest progress - from the internet to GPS to public libraries</span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></span>
                <span>This is our moment to build AI infrastructure before private business models lock us out</span>
              </li>
              <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></span>
                <span>Once consolidated, it becomes much harder to create public alternatives</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Public AI is Already Happening */}
        <section className="bg-muted/30 -mx-6 px-6 py-20">
          <div className="max-w-6xl mx-auto text-left space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <Globe className="w-8 h-8 text-green-500" />
              <h2 className="text-4xl md:text-5xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Real examples around the world
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-lg border-l-4 border-red-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Singapore</h3>
                <p className="text-muted-foreground">Building SEA-LION models for Southeast Asian languages underserved by commercial AI</p>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-red-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Switzerland</h3>
                <p className="text-muted-foreground">Using supercomputing for AI models focused on science, education, and sustainability</p>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-red-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">United States</h3>
                <p className="text-muted-foreground">NAIRR pilot providing researchers access to AI compute and datasets</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-xl text-muted-foreground">
                These projects show public AI can deliver real benefits markets ignore
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Three Ways Forward */}
        <section className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Building className="w-8 h-8 text-purple-500" />
            <h2 className="text-4xl md:text-5xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              How we build Public AI
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-200">
              <h3 className="text-2xl font-medium text-foreground mb-3">Public Infrastructure</h3>
              <p className="text-muted-foreground">Shared compute, datasets, and models anyone can build upon</p>
            </div>
            <div className="p-6 bg-card rounded-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-200">
              <h3 className="text-2xl font-medium text-foreground mb-3">Public Alternatives</h3>
              <p className="text-muted-foreground">Complete alternatives to ChatGPT and Claude owned by the public</p>
            </div>
            <div className="p-6 bg-card rounded-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-200">
              <h3 className="text-2xl font-medium text-foreground mb-3">Solving Real Problems</h3>
              <p className="text-muted-foreground">AI tackling challenges markets ignore - public health, education access, climate solutions</p>
            </div>
          </div>
        </section>

        {/* Section 6: Get Involved */}
        <section className="bg-muted/30 -mx-6 px-6 py-20">
          <div className="max-w-6xl mx-auto text-left space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl md:text-5xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Join the movement
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mb-8">
              Public AI needs supporters from every background:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-lg border-l-4 border-blue-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Researchers & Developers</h3>
                <p className="text-muted-foreground mb-4">Contribute to open models and use public compute resources</p>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => window.open('https://app.publicai.company', '_blank')}
                >
                  Start Contributing
                </Button>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-green-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Organizations</h3>
                <p className="text-muted-foreground mb-4">Choose public AI options when available</p>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open('https://app.publicai.company', '_blank')}
                >
                  Partner With Us
                </Button>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-yellow-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Policymakers</h3>
                <p className="text-muted-foreground mb-4">Support legislation for public AI infrastructure investment</p>
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => window.open('https://app.publicai.company', '_blank')}
                >
                  Learn More
                </Button>
              </div>
              <div className="p-6 bg-card rounded-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-200">
                <h3 className="text-2xl font-medium text-foreground mb-3">Everyone</h3>
                <p className="text-muted-foreground mb-4">Advocate for AI that serves the public interest</p>
                <Button 
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => window.open('https://app.publicai.company', '_blank')}
                >
                  Get Involved
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA Section */}
      <div className="border-t border-border bg-gradient-to-r from-primary/10 to-blue-500/10 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Ready to shape the future of AI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of researchers, developers, and advocates building AI infrastructure for everyone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg"
              onClick={() => router.push('/chat')}
            >
              Try the Demo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent border-border text-foreground hover:bg-muted px-8 py-4 text-lg"
              onClick={() => window.open('https://app.publicai.company', '_blank')}
            >
              Get Started
            </Button>
          </div>
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              🚀 Join the movement for publicly accountable AI infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}