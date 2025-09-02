import Article from "@/components/Article";

export default function AirbusPage() {
  const articleData = {
    title: "An Airbus for AI",
    subtitle: "Building the public infrastructure for artificial intelligence.",
    date: "September 1, 2025",
    heroImage: {
      src: "/airbus.jpg",
      alt: "An Airbus for AI"
    },
    sections: [
      {
        type: 'paragraph' as const,
        content: "In 1970, European governments came together to build Airbus—a consortium that would challenge Boeing's dominance and establish Europe as a major force in commercial aviation. Today, we face a similar moment in artificial intelligence."
      },
      {
        type: 'paragraph' as const,
        content: "The AI landscape is dominated by a handful of American companies. Meanwhile, the rest of the world—governments, institutions, researchers, and citizens—depends on their infrastructure, their models, and their terms."
      },
      {
        type: 'paragraph' as const,
        content: "It's time for a different approach. It's time for an Airbus for AI."
      },
      {
        type: 'list' as const,
        content: [
          "Read the <a href='/airbus-for-ai.pdf' target='_blank'>full policy brief</a>."
        ]
      },
      {
        type: 'heading' as const,
        content: "A Third Way for AI"
      },
      {
        type: 'paragraph' as const,
        content: "Public AI represents a third way forward—neither the closed, proprietary systems of Big Tech nor the chaotic free-for-all of unregulated open source. Instead, we're building public infrastructure for AI: transparent, accountable, and designed to serve the common good."
      },
      {
        type: 'paragraph' as const,
        content: "This means:"
      },
      {
        type: 'list' as const,
        content: [
          "Open models that anyone can inspect, modify, and deploy",
          "Public compute infrastructure that reduces dependence on commercial clouds",
          "Governance frameworks that ensure AI serves democratic values",
          "International cooperation that spreads benefits globally"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Just as Airbus proved that European cooperation could compete with American aerospace giants, Public AI demonstrates that international collaboration can create viable alternatives to Silicon Valley's AI monopoly."
      },
      {
        type: 'heading' as const,
        content: "Why Now?"
      },
      {
        type: 'paragraph' as const,
        content: "The window for building alternative AI infrastructure is closing rapidly. As AI becomes more central to economic and social life, dependence on a small number of companies becomes a strategic vulnerability."
      },
      {
        type: 'paragraph' as const,
        content: "Consider the parallels:"
      },
      {
        type: 'list' as const,
        content: [
          "In the 1960s, Europe depended entirely on American aircraft manufacturers",
          "Today, much of the world depends entirely on American AI companies",
          "Airbus was created to ensure European technological sovereignty",
          "Public AI is being built to ensure global AI sovereignty"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "The difference is scale and urgency. While aviation affects transportation, AI affects everything. The stakes are higher, and the timeline is shorter."
      },
      {
        type: 'paragraph' as const,
        content: "But the opportunity is also greater. Unlike aerospace, AI infrastructure can be shared digitally, instantly, and at near-zero marginal cost. A successful model trained in Switzerland can be deployed in Singapore, São Paulo, or Stockholm within minutes."
      },
      {
        type: 'heading' as const,
        content: "Next Steps"
      },
      {
        type: 'paragraph' as const,
        content: "Public AI is already working with governments, universities, and research institutions across multiple continents. Our goal is simple: ensure that no country, institution, or individual is forced to depend solely on proprietary AI systems."
      },
      {
        type: 'paragraph' as const,
        content: "We're building:"
      },
      {
        type: 'list' as const,
        content: [
          "A global network of public compute infrastructure",
          "Open models trained on diverse, multilingual datasets",
          "Governance frameworks that embed democratic values",
          "Technical standards that ensure interoperability and transparency"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "The Airbus consortium began with just four European countries. Today, it's a global enterprise that employs hundreds of thousands and serves airlines worldwide."
      },
      {
        type: 'paragraph' as const,
        content: "Public AI starts with a simple recognition: artificial intelligence is too important to be left entirely to private markets. Like roads, power grids, and communication networks, AI infrastructure should serve the public interest."
      },
      {
        type: 'paragraph' as const,
        content: "The question isn't whether we need public alternatives to private AI. The question is whether we'll build them in time."
      }
    ]
  };

  return <Article {...articleData} />;
}