import Article from "@/components/Article";

export default function ContributingPage() {
  const articleData = {
    title: "Contributing",
    subtitle: "Help us build AI for everyone",
    date: "September 2, 2025",
    sections: [
      {
        type: 'image' as const,
        content: "/josh_puppy.jpeg",
        className: "float-right ml-6 mb-4 w-64 h-auto rounded-lg"
      },
      {
        type: 'paragraph' as const,
        content: "First off, thank you for considering contributing to our project!"
      },
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is the world's first public inference infrastructure for sovereign AI models like Apertus. We welcome contributors from around the world, whether you're a developer, designer, researcher, policymaker, organizer, or just curious."
      },
      {
        type: 'heading' as const,
        content: "Start here"
      },
      {
        type: 'list' as const,
        content: [
          'If you have an issue with the site, fill out an issue in <a href="https://github.com/forpublicai/chat.publicai.co/issues" class="text-blue-600 hover:text-blue-800 underline">our GitHub</a>.',
          'If you want to contribute in other ways, drop a CV or bio into our 30-second contributing form: <a href="https://docs.google.com/forms/d/e/1FAIpQLSf8vELDGrfgxCt-jxmRHTPYuVzwt8Xv5Vof4H_Oj5XPX_PIWg/viewform?usp=sharing&ouid=103551188321552533427" class="text-blue-600 hover:text-blue-800 underline">I want to contribute</a>.'
        ]
      },
      {
        type: 'heading' as const,
        content: "Developers"
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            Looking to help with backend, frontend, ops, or evaluation? Check out our <a href="https://platform.publicai.co" className="text-blue-600 hover:text-blue-800 underline">Developer Guide</a> for information on our architecture and platform.
          </>
        )
      },
      {
        type: 'paragraph' as const,
        content: "Key areas we need help on:"
      },
      {
        type: 'list' as const,
        content: [
          "Evaluation & monitoring",
          "Specialized telemetry and data pipelines to send (useful) data back to national labs and open source model builders",
          "Setting up (and getting something out of) Mixpanel or other kinds of product analytics",
          "Optimizing our authentication flow (we're using Amazon Cognito right now)",
          "Design and deploy a reputation system based on data contributions a.k.a. 'Public AI Plus/Pro'",
          "Load balancing and gateway configuration (we're using Zuplo)",
          "vLLM / HF CICD pipeline with national labs",
          "General chat UI improvements",
          "Technical documentation (!!)",
          "Or just add the H100 sitting in your basement to the utility"
        ]
      },
      {
        type: 'heading' as const,
        content: "Civic & Creative Contributors"
      },
      {
        type: 'paragraph' as const,
        content: "You don't need to write code to make a meaningful impact. We're especially looking for people who can:"
      },
      {
        type: 'list' as const,
        content: [
          "Run and manage distributed contributor teams (e.g. product, policy, or ops)",
          "☝️ is especially important, because we need to coordinate other contributors",
          "Support design and storytelling",
          "Draft and communicate policy guidance, especially in local governments",
          "Help us build a community of contributors",
          "Organize more compute donations"
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