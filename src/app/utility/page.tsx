import Article from "@/components/Article";

export default function UtilityPage() {
  const articleData = {
    title: "Inference Utility",
    subtitle: "A public compute platform for running AI models that serves researchers, developers, and institutions worldwide.",
    date: "September 1, 2025",
    sections: [
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is a global compute platform that provides free and low-cost access to state-of-the-art AI models. Built on principles of openness, accessibility, and democratic governance, the Utility serves as critical infrastructure for the AI ecosystem."
      },
      {
        type: 'paragraph' as const,
        content: "Unlike commercial AI APIs that prioritize profit maximization, the Utility is designed to serve the public interest. We provide transparent pricing, open governance, and equitable access to ensure that AI capabilities are available to everyone, not just those who can afford premium services."
      },
      {
        type: 'heading' as const,
        content: "Why it matters"
      },
      {
        type: 'paragraph' as const,
        content: "Access to AI compute has become a critical bottleneck for innovation. Researchers at universities can't afford commercial APIs. Developers in emerging markets face pricing barriers. Civil society organizations lack the resources to experiment with AI tools."
      },
      {
        type: 'paragraph' as const,
        content: "The Utility addresses these challenges by providing:"
      },
      {
        type: 'list' as const,
        content: [
          "Free tier access for researchers and educators",
          "Transparent, cost-based pricing for all users",
          "Priority access for public interest projects",
          "Open governance and community oversight"
        ]
      },
      {
        type: 'heading' as const,
        content: "What you can do with it"
      },
      {
        type: 'paragraph' as const,
        content: "The Utility supports a wide range of AI applications and use cases:"
      },
      {
        type: 'list' as const,
        content: [
          "Research and experimentation with cutting-edge models",
          "Educational projects and coursework",
          "Civic technology and social good applications",
          "Commercial development and prototyping",
          "Creative projects and artistic exploration"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "All major model types are supported: language models, vision models, multimodal systems, and specialized domain models. We prioritize hosting open-source models that can be inspected, modified, and deployed by users."
      },
      {
        type: 'heading' as const,
        content: "Who is it for?"
      },
      {
        type: 'paragraph' as const,
        content: "The Utility is designed to serve diverse communities with different needs and resources:"
      },
      {
        type: 'list' as const,
        content: [
          "Academic researchers conducting AI research",
          "Students learning about machine learning and AI",
          "Nonprofit organizations developing civic technology",
          "Startups and small businesses building AI applications",
          "Artists and creators exploring AI-assisted workflows",
          "Government agencies evaluating AI capabilities"
        ]
      },
      {
        type: 'heading' as const,
        content: "🔋 How it's sustained"
      },
      {
        type: 'paragraph' as const,
        content: "The Utility operates on a sustainable, mission-driven model:"
      },
      {
        type: 'list' as const,
        content: [
          "Free access is supported by grants and donations",
          "Paid tiers cover operational costs at transparent, cost-based pricing",
          "Enterprise partnerships provide additional funding",
          "Community contributions help with governance and oversight"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We publish regular transparency reports showing how funds are used, what our costs are, and how we're working to expand access."
      },
      {
        type: 'heading' as const,
        content: "Governance & affiliation"
      },
      {
        type: 'paragraph' as const,
        content: "The Utility is governed by Public AI, a nonprofit organization, with oversight from an international advisory board. Key decisions about pricing, access policies, and model selection are made through transparent, community-informed processes."
      },
      {
        type: 'paragraph' as const,
        content: "We work closely with academic institutions, civil society organizations, and government agencies to ensure the Utility serves genuine public needs."
      },
      {
        type: 'heading' as const,
        content: "Roadmap"
      },
      {
        type: 'paragraph' as const,
        content: "Our development roadmap focuses on expanding access, improving capabilities, and strengthening governance:"
      },
      {
        type: 'list' as const,
        content: [
          "Geographic expansion to serve users in more regions",
          "Increased model diversity and specialized capabilities",
          "Enhanced tools for researchers and developers",
          "Stronger community governance mechanisms",
          "Partnerships with more public institutions globally"
        ]
      },
      {
        type: 'heading' as const,
        content: "Developers"
      },
      {
        type: 'paragraph' as const,
        content: "Get started with the Utility through our developer platform:"
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://platform.publicai.co/" class="text-blue-600 hover:text-blue-800 underline">Platform Access</a>',
          "RESTful API with standard endpoints",
          "SDKs for Python, JavaScript, and other languages",
          "Comprehensive documentation and tutorials",
          "Community support forums"
        ]
      },
      {
        type: 'heading' as const,
        content: "Civic & Creative Contributors"
      },
      {
        type: 'paragraph' as const,
        content: "We especially welcome projects that use AI for social good, civic engagement, and creative expression. Special programs include:"
      },
      {
        type: 'list' as const,
        content: [
          "Research grants for public interest AI projects",
          "Free access for verified educational and nonprofit use",
          "Technical support for high-impact applications",
          "Collaboration opportunities with our team"
        ]
      },
      {
        type: 'heading' as const,
        content: "Code of Conduct"
      },
      {
        type: 'paragraph' as const,
        content: "All users of the Utility agree to use AI responsibly and ethically. Our community standards prohibit:"
      },
      {
        type: 'list' as const,
        content: [
          "Generating harmful, discriminatory, or illegal content",
          "Violating privacy or attempting to identify individuals",
          "Creating misinformation or deepfakes without disclosure",
          "Using the platform for surveillance or oppression",
          "Commercial use that undermines the public mission"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We work with users to ensure AI is deployed in ways that benefit society and respect human rights."
      }
    ]
  };

  return <Article {...articleData} />;
}