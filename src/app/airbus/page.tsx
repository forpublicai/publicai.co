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
        content: "In the 1960s, Airbus was born from a recognition that no single European company could compete with the scale and dominance of Boeing. The solution, put together by the French prime minister and the German chancellor (and later their Spanish and British counterparts), was cooperation: a multilateral industrial consortium now known as Airbus. And today, Airbus isn’t just competitive—it’s the largest aerospace manufacturer in the world."
      },
      {
        type: 'paragraph' as const,
        content: "In AI today, we face a similar landscape. A few U.S.-based companies dominate the frontier. China is building its own parallel ecosystem with full state backing. The rest of the world—Europe, Canada, Japan, Australia, Singapore, South Korea, and beyond—is investing billions of public funds into sovereign AI strategies but still struggling to achieve global relevance at the frontier."
      },
      {
        type: 'paragraph' as const,
        content: "But there is another path. In a new policy brief, computer scientist Joshua Tan, product manager Brandon Jackson, policy thinker Robin Berjon, and economist Diane Coyle make the case for a third way in frontier AI: an international, public-private frontier lab built on democratic values, multilateral coordination, and open infrastructure. They call it an Airbus for AI."
      },
      {
        type: 'list' as const,
        content: [
          "Read the <a href='/airbus-for-ai.pdf' target='_blank'>full Airbus for AI policy brief</a>."
        ]
      },
      {
        type: 'heading' as const,
        content: "A Third Way for AI"
      },
      {
        type: 'paragraph' as const,
        content: "Across Europe and other middle-power countries, governments are spending heavily on national AI efforts—but coordination remains weak. Most funding goes to either small-scale startups or big-ticket industrial alliances, with little focus on creating shared, sovereign AI capacity."
      },
      {
        type: 'paragraph' as const,
        content: "In the meantime, many open-source model developers are hitting walls. Training costs are rising fast. Compute access is uneven. Foundation model development is drifting toward opacity again. And many public institutions still feel sidelined from the frontier—either because they lack scale or because the dominant narrative says that only Big Tech can lead."
      },
      {
        type: 'paragraph' as const,
        content: "This is a dangerous myth."
      },
      {
        type: 'paragraph' as const,
        content: 'As the brief argues, the world needs alternatives. A multilateral lab "for the rest of the world" can provide that—by demonstrating that AI can be a public good, and that countries can build it together.'
      },
      {
        type: 'paragraph' as const,
        content: "The Airbus for AI proposal is already informing discussions with policymakers, national labs, and research coalitions. Our team is actively incubating the idea—and supporting partners in designing the first concrete steps."
      },
      {
        type: 'paragraph' as const,
        content: "The question isn't whether we need public alternatives to private AI. The question is whether we'll build them in time."
      }
    ]
  };

  return <Article {...articleData} />;
}