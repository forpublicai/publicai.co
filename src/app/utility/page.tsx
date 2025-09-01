import Article from "@/components/Article";

export default function UtilityPage() {
  const articleData = {
    title: "Inference Utility",
    subtitle: "AI for everyone",
    date: "September 1, 2025",
    sections: [
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is the public access point for open and sovereign AI models. Imagine a water or electric utility—but for AI."
      },
      {
        type: 'paragraph' as const,
        content: "It's a lightweight, open-source frontend and deployment layer that runs on compute from public and private partners around the world, giving citizens, researchers, and policymakers a simple chat interface to interact with vetted open models."
      },
      {
        type: 'paragraph' as const,
        content: "Instead of depending on private APIs, the Utility offers direct access to models built by public institutions, backed by transparent governance and a sustainable funding model."
      },
      {
        type: 'heading' as const,
        content: "Why it matters"
      },
      {
        type: 'paragraph' as const,
        content: "Today, nearly all AI access is mediated by private companies. Even when open models exist, public access is fragmented, opaque, and fragile."
      },
      {
        type: 'paragraph' as const,
        content: "The Inference Utility fills that gap:"
      },
      {
        type: 'list' as const,
        content: [
          "<strong>Public access to public AI</strong> — a shared service for citizens, researchers, and institutions",
          "<strong>Clean, easy-to-use interface</strong> — chat with open models, integrated with search and national knowledgebases",
          "<strong>Sovereign infrastructure in progress</strong> — anchored in publicly funded deployments"
        ]
      },
      {
        type: 'heading' as const,
        content: "What you can do with it"
      },
      {
        type: 'list' as const,
        content: [
          "<strong>Open source interface.</strong> Inspectable code and transparent routing.",
          "<strong>Multilingual & jurisdiction-aware.</strong> Tuned for European and international deployments.",
          "<strong>Multiple vetted models.</strong> Access to a range of open-weight models from national labs and research centers.",
          "<strong>Privacy-first.</strong> By default, user prompts and outputs are not logged.",
          "<strong>Public governance.</strong> Funding, model selection, and operating principles are openly documented."
        ]
      },
      {
        type: 'heading' as const,
        content: "Who is it for?"
      },
      {
        type: 'list' as const,
        content: [
          "Citizens & communities seeking a trustworthy alternative to corporate APIs",
          "Public sector initiatives piloting or scaling sovereign AI models",
          "Academics & nonprofits who need reliable access to open models",
          "Policy institutions & regulators testing transparent AI deployments"
        ]
      },
      {
        type: 'heading' as const,
        content: "How it's sustained"
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
        type: 'paragraph' as const,
        content: "The goal is to make AI inference a public service, not a private privilege."
      },
      {
        type: 'heading' as const,
        content: "Governance & affiliation"
      },
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is built by Metagov, a nonprofit research lab, under its Airbus for AI initiative. It is part of the broader movement for public AI — an effort to make AI a form of public infrastructure, like highways, water, or electricity."
      },
      {
        type: 'heading' as const,
        content: "Roadmap"
      },
      {
        type: 'paragraph' as const,
        content: "After the Apertus launch, we hope to expand the Utility with new launch partnerships in countries like Singapore, Spain, and Canada. Other improvements: integrated web search, support for image models and multimodal queries, and more jurisdiction-aware handling to reflect different legal and cultural contexts. On the sustainability side, we are refining both the advertising-supported and utility-style business models, while testing \"Plus\" and \"Pro\" tiers that remain accessible. Longer-term, we want the Utility to support national data flywheels and nation-scale inference infrastructure."
      }
    ]
  };

  return <Article {...articleData} />;
}