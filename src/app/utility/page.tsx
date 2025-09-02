import Article from "@/components/Article";

export default function UtilityPage() {
  const articleData = {
    title: "About the Inference Utility",
    subtitle: "Public AI for countries",
    date: "September 2, 2025",
    sections: [
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is the public access point for open and sovereign AI models. Imagine a water or electric utility, but instead of H20 or electrons, you're getting inference on tap."
      },
      {
        type: 'paragraph' as const,
        content: "The Utility uses a fully-featured, open-source frontend and a deployment layer that runs on compute from public and private partners around the world. We offer stable, direct access to models built by national (and international) public institutions."
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
          "<strong>Open source interface.</strong> Inspectable code and transparent routing.",
          "<strong>Multilingual & jurisdiction-aware.</strong> Tuned for European and international deployments.",
          "<strong>Multiple vetted models.</strong> Access to a range of open-weight models from national labs and research centers.",
          "<strong>Privacy-first.</strong> By default, user prompts and outputs are not logged.",
          "<strong>Public governance.</strong> Funding, model selection, and operating principles are openly documented.",
          "<strong>Search and tool usage</strong> - ...",
          "<strong>National knowledgebases</strong> - ...",
        ]
      },
      {
        type: 'heading' as const,
        content: "How it works"
      },
      {
        type: 'paragraph' as const,
        content: "The Utility is a pilot in building a sustainable business model for public AI access. It combines:"
      },
      {
        type: 'list' as const,
        content: [
          "Donated compute from academic, nonprofit, and industry partners",
          "Advertising subsidies to offset costs of free public access",
          "State and institutional funding to guarantee long-term availability"
        ]
      },
      {
        type: 'heading' as const,
        content: "Roadmap"
      },
      {
        type: 'paragraph' as const,
        content: "After the Apertus launch, we hope to expand the Utility with new launch partnerships in countries like Singapore, Spain, and Canada. Other improvements: integrated web search, support for image models and multimodal queries, and more jurisdiction-aware handling to reflect different legal and cultural contexts. On the sustainability side, we are refining both the advertising-supported and utility-style business models, while testing \"Plus\" and \"Pro\" tiers that remain accessible. Longer-term, we want the Utility to support national data flywheels and nation-scale inference infrastructure."
      },
      {
        type: 'heading' as const,
        content: "Why it matters"
      },
      {
        type: 'paragraph' as const,
        content: "First off, public / sovereign AI initiatives sometimes need help scaling their models. Despite the fact that many of these initiatives are based at national supercomputing facilities, they often struggle to access enough compute for inference. Nor are they equipped to offer a public-facing service. The Utility solves this problem."
      },
      {
        type: 'paragraph' as const,
        content: (
          <>            
            We're also trying to complement efforts within the open-source ML ecosystem. Today, nearly all foundation model access is mediated by private companies. Even when open models exist, public access is fragmented, opaque, and fragile. The Inference Utility is a step towards a more open and accessible AI ecosystem. In many ways, it's trying to fill in <a href="https://arxiv.org/abs/2507.09296" className="text-blue-600 hover:text-blue-800 underline">the gaps in the existing open-source ecosystem</a>.
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