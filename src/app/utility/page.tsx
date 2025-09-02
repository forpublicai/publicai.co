import Article from "@/components/Article";

export default function UtilityPage() {
  const articleData = {
    title: "About the Inference Utility",
    subtitle: "Public AI for countries",
    date: "September 2, 2025",
    sections: [
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is the public access point for public and sovereign AI models."
      },
      {
        type: 'paragraph' as const,
        content: "The Utility uses a fully-featured, open-source frontend and a deployment layer that runs on compute from public and private partners around the world. We offer stable, direct access to models built by national (and international) public institutions. Imagine a water or electric utility, but instead of H20 or electrons, you're getting inference on tap."
      },
      {
        type: 'heading' as const,
        content: "What you can do with it"
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            Try using it: <a href="https://chat.publicai.co" className="text-blue-600 hover:text-blue-800 underline">chat.publicai.co</a>.
          </>
        )
      },
      {
        type: 'image' as const,
        content: "/ui_switzerland.png",
        className: "w-2/3 mx-auto mb-8 rounded-lg"
      },
      {
        type: 'paragraph' as const,
        content: "Some features you might not notice:"
      },
      {
        type: 'list' as const,
        content: [
          '<strong>Everything is open source!</strong> Inspect our frontend <a href="http://github.com/forpublicai/publicai.co" className="text-blue-600 hover:text-blue-800 underline">here</a>, and our app <a href="http://github.com/forpublicai/chat.publicai.co" className="text-blue-600 hover:text-blue-800 underline">here</a>.',
          "<strong>Multiple vetted models.</strong> Access Apertus from Switzerland as well as SEA-LION v4 from Singapore. More coming soon.",
          '<strong>National system prompts.</strong> Currently for <a href="https://github.com/forpublicai/chat.publicai.co/blob/main/community/system_prompts/switzerland.md" className="text-blue-600 hover:text-blue-800 underline">Switzerland</a> and for <a href="https://github.com/forpublicai/chat.publicai.co/blob/main/community/system_prompts/singapore.md" className="text-blue-600 hover:text-blue-800 underline">Singapore</a>. Decide as a community what the system prompt should be.',
          "<strong>National knowledgebases</strong> - While logged in, try using typing # in the chat to reference national RAG systems for Switzerland and Singapore. (Still experimental.)",
          "<strong>Search and tool usage</strong> - Integrated web search and tool plugins expand the base model’s capabilities. Try the Schwiizerdütsch plugin, our German-speaking users love it.",
          "<strong>Privacy-first.</strong> By default, user prompts and outputs are not logged or used for training.",
          "<strong>Public governance.</strong> Our funding, model selection, and operating principles are fully open."
        ]
      },
      {
        type: 'heading' as const,
        content: "How it works"
      },
      {
        type: 'paragraph' as const,
        content: "The Inference Utility runs on a distributed infrastructure that combines an open-source frontend, a vLLM-powered backend, and a deployment layer designed for resilience across multiple partners. The frontend is a lightweight React/Tailwind interface. Behind the scenes, inference is handled by servers running OpenAI-compatible APIs on vLLM. These servers are deployed across clusters donated by national and industry partners. A global load-balancing layer ensures that requests are routed efficiently and transparently, regardless of which country’s compute is serving the query."
      },
      {
        type: 'paragraph' as const,
        content: "Sustainability comes from blending different funding models. Free public access is supported by donated GPU time and advertising subsidies, while long-term stability is intended to be anchored by state and institutional contributions. For users who need higher availability or premium features, we plan to offer tiers that remain accessible while helping to cover operating costs."
      },
      {
        type: 'heading' as const,
        content: "Roadmap"
      },
      {
        type: 'paragraph' as const,
        content: "After the Apertus launch, we hope to expand the Utility with new launch partnerships in countries like Singapore, Spain, and Canada. Other improvements: support for image models and multimodal queries, and more jurisdiction-aware handling to reflect different legal and cultural contexts. On the sustainability side, we are refining both the advertising-supported and utility-style business models, while testing \"Plus\" and \"Pro\" tiers that remain accessible (we'd like to experiment with models based on Wikipedia-style data contributions, though we might supplement that with subscription-based models). Longer-term, we want the Utility to support national data flywheels and nation-scale inference infrastructure."
      },
      {
        type: 'heading' as const,
        content: "Why it matters"
      },
      {
        type: 'paragraph' as const,
        content: "Public and sovereign AI labs can build world-class models, but they often lack the compute and infrastructure to serve them reliably. Despite their awesome power, national supercomputing centers are not set up for 24/7 public inference, nor are they equipped to offer a user-facing service. The Utility solves this problem."
      },
      {
        type: 'paragraph' as const,
        content: (
          <>            
            It also complements the open-source ML ecosystem by providing stable, transparent, and accountable access to open models—something that is currently only available from private APIs. The Inference Utility is a step towards a more open and accessible AI ecosystem. In many ways, it&apos;s trying to fill in <a href="https://arxiv.org/abs/2507.09296" className="text-blue-600 hover:text-blue-800 underline">the gaps in the existing open-source ecosystem</a>.
          </>
        )
      },
      {
        type: 'heading' as const,
        content: "Learn more"
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            To learn more about the team behind the Utility, go to our <a href="/about" className="text-blue-600 hover:text-blue-800 underline">about page</a>.
          </>
        )
      },
    ]
  };

  return <Article {...articleData} />;
}