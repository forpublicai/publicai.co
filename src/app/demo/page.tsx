'use client';

import Link from "next/link";
import { useState } from "react";

export default function DemoPage() {
  const [selectedModel, setSelectedModel] = useState("apertus");

  const models = [
    {
      id: "apertus",
      name: "Apertus",
      description: "Swiss-made open source language model",
      origin: "Switzerland",
      color: "bg-red-50 border-red-200"
    },
    {
      id: "sealion",
      name: "SEA-LION",
      description: "Southeast Asian language model",
      origin: "Singapore",
      color: "bg-blue-50 border-blue-200"
    }
  ];

  const features = [
    {
      title: "Public Infrastructure",
      description: "AI models as a public good, accessible to everyone",
      icon: "🏛️"
    },
    {
      title: "Sovereign Models",
      description: "Nation-scale AI deployments with local control",
      icon: "🌍"
    },
    {
      title: "Open Source",
      description: "Fully transparent and community-driven development",
      icon: "💻"
    },
    {
      title: "Free or Low-Cost",
      description: "Democratizing access to advanced AI capabilities",
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-normal text-black mb-6 leading-tight">
              Live Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of public AI infrastructure with interactive demonstrations of our sovereign language models.
            </p>
          </div>

          {/* Interactive Model Selector */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">Select a Model</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedModel === model.id
                        ? model.color + " border-opacity-100 shadow-md"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="text-xl font-semibold text-black mb-2">{model.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                    <p className="text-xs text-gray-500">Origin: {model.origin}</p>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href={`/chat?message=Tell me about ${models.find(m => m.id === selectedModel)?.name}`}
                  className="inline-block bg-black text-white hover:bg-gray-800 rounded-full px-8 py-4 font-medium transition-colors"
                >
                  Try {models.find(m => m.id === selectedModel)?.name} Now
                </Link>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-black mb-8 text-center">Why Public AI?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example Section */}
          <div className="bg-gray-900 rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Developer API</h2>
            <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
                <code>{`curl https://api.publicai.co/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "apertus-8b",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`}</code>
              </pre>
            </div>
            <p className="text-gray-400 mt-4 text-sm">
              Get started with our developer platform at{" "}
              <a href="https://platform.publicai.co" className="text-blue-400 hover:text-blue-300 underline">
                platform.publicai.co
              </a>
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-black mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the movement to make AI a public good. Try our models, contribute to the project, or deploy your own sovereign AI infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="bg-red-500 text-white hover:bg-red-600 rounded-full px-8 py-4 font-medium transition-colors"
              >
                Try the Chat Interface
              </Link>
              <Link
                href="/contributing"
                className="bg-white text-black border-2 border-black hover:bg-gray-50 rounded-full px-8 py-4 font-medium transition-colors"
              >
                Contribute to the Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-600">Open Source</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">Free</div>
              <div className="text-gray-600">For Public Good</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">Global</div>
              <div className="text-gray-600">Infrastructure</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
