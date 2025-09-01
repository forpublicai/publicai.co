import Article from "@/components/Article";

export default function ContributingPage() {
  const articleData = {
    title: "Contributing",
    subtitle: "Help us build public AI infrastructure for everyone",
    date: "December 2024",
    sections: [
      {
        type: 'paragraph' as const,
        content: "First off, thank you for considering contributing to our project!"
      },
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is the world's first public inference infrastructure for large-scale, sovereign AI models like Apertus. It's part of a global effort to turn AI into a form of public infrastructure like highways, water, or electricity."
      },
      {
        type: 'paragraph' as const,
        content: "We welcome contributors from around the world, whether you're a developer, designer, researcher, policymaker, organizer, or just curious."
      },
      {
        type: 'heading' as const,
        content: "Start here"
      },
      {
        type: 'list' as const,
        content: [
          "If you have an issue with the site, fill out an issue in our GitHub.",
          '<a href="#" class="text-blue-600 hover:text-blue-800 underline">If you want to contribute in other ways, drop a CV or bio into our 30-second contributing form: I want to contribute</a>'
        ]
      },
      {
        type: 'heading' as const,
        content: "Developers"
      },
      {
        type: 'paragraph' as const,
        content: "Looking to help with backend, frontend, ops, or evaluation?"
      },
      {
        type: 'paragraph' as const,
        content: '<a href="/docs" class="text-blue-600 hover:text-blue-800 underline">Check out the Developer Guide</a> for information on our architecture and platform.'
      },
      {
        type: 'paragraph' as const,
        content: "Key areas we need help on:"
      },
      {
        type: 'list' as const,
        content: [
          "Evaluation & monitoring",
          "Specialized telemetry and data pipelines",
          "Setting up (and getting something out of) Mixpanel",
          "Optimizing our authentication flow",
          "Design and deploy a reputation system based on data contributions",
          "Load balancing and gateway configuration",
          "vLLM / HF CICD pipeline with national labs",
          "General chat UI improvements"
        ]
      },
      {
        type: 'heading' as const,
        content: "Civic & Creative Contributors"
      },
      {
        type: 'paragraph' as const,
        content: "You don't need to write code to make a meaningful impact."
      },
      {
        type: 'paragraph' as const,
        content: "We're especially looking for people who can:"
      },
      {
        type: 'list' as const,
        content: [
          "Run and manage distributed contributor teams (e.g. product, policy, or ops)",
          "<strong>☝️ is especially important, because we need to coordinate other contributors</strong>",
          "Translate content and documentation (i18n / l10n)",
          "Support design and storytelling",
          "Draft and communicate policy guidance, especially in local governments"
        ]
      },
      {
        type: 'heading' as const,
        content: "Code of Conduct"
      },
      {
        type: 'paragraph' as const,
        content: "We'll have a code of conduct soon. In the meantime, don't be a jerk."
      }
    ]
  };

  return <Article {...articleData} />;
}