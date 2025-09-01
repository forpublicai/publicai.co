import Article from "@/components/Article";

export default function DocsPage() {
  const articleData = {
    title: "Docs",
    subtitle: "Documentation for Public AI's inference utility and platform.",
    date: "September 1, 2025",
    sections: [
      {
        type: 'heading' as const,
        content: "General OpenWebUI Usage"
      },
      {
        type: 'heading' as const,
        content: "Getting Started"
      },
      {
        type: 'paragraph' as const,
        content: "To use the Public AI inference utility, simply visit https://chat.publicai.co and start chatting. No account required for basic usage."
      },
      {
        type: 'paragraph' as const,
        content: "The interface is built on OpenWebUI, an open-source chat interface that provides a familiar experience similar to other AI chat platforms."
      },
      {
        type: 'heading' as const,
        content: "Features"
      },
      {
        type: 'list' as const,
        content: [
          "Multiple AI models available",
          "Real-time chat interface", 
          "Conversation history",
          "Model switching",
          "File uploads (where supported)",
          "Export conversations"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "The platform supports various input types including text, images, and documents depending on the selected model's capabilities."
      },
      {
        type: 'heading' as const,
        content: "Accessibility and Customization"
      },
      {
        type: 'paragraph' as const,
        content: "The interface includes accessibility features and customization options:"
      },
      {
        type: 'list' as const,
        content: [
          "Dark and light themes",
          "Adjustable font sizes",
          "Keyboard shortcuts",
          "Screen reader compatibility"
        ]
      },
      {
        type: 'heading' as const,
        content: "Understanding Model Providers"
      },
      {
        type: 'paragraph' as const,
        content: "Public AI aggregates models from multiple providers to offer you the best available options. When you select a model, you're choosing from our curated list of high-quality AI systems."
      },
      {
        type: 'paragraph' as const,
        content: "We prioritize open-source and transparent models where possible, but also include proprietary models when they offer significant value to users."
      },
      {
        type: 'heading' as const,
        content: "Current Model Providers"
      },
      {
        type: 'paragraph' as const,
        content: "Our platform currently includes models from:"
      },
      {
        type: 'list' as const,
        content: [
          "Anthropic (Claude models)",
          "OpenAI (GPT models)",
          "Meta (Llama models)",
          "Google (Gemini models)",
          "Mistral AI",
          "Swiss AI Initiative (Apertus)",
          "Other open-source providers"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "This list is regularly updated as new models become available and existing ones are improved."
      },
      {
        type: 'heading' as const,
        content: "How to See Which Model You're Using"
      },
      {
        type: 'paragraph' as const,
        content: "The currently selected model is displayed at the top of the chat interface. You can:"
      },
      {
        type: 'list' as const,
        content: [
          "Click the model name to see details",
          "Switch between available models",
          "View model capabilities and limitations",
          "See provider information"
        ]
      },
      {
        type: 'heading' as const,
        content: "Provider Transparency"
      },
      {
        type: 'paragraph' as const,
        content: "We believe in transparency about which models and providers you're using. Each model listing includes:"
      },
      {
        type: 'list' as const,
        content: [
          "Provider name and information",
          "Model version and capabilities",
          "Any usage limitations or restrictions",
          "Links to provider documentation"
        ]
      },
      {
        type: 'heading' as const,
        content: "Data Details"
      },
      {
        type: 'heading' as const,
        content: "Privacy and Data Flow"
      },
      {
        type: 'paragraph' as const,
        content: "When you use Public AI's inference utility, your conversations may be processed by different AI providers depending on which model you select. Here's how your data flows:"
      },
      {
        type: 'list' as const,
        content: [
          "You send a message through our interface",
          "We route it to the appropriate model provider",
          "The provider processes your request and returns a response",
          "We display the response to you"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Your conversations are temporarily stored to enable features like conversation history, but we do not permanently retain personal data unless explicitly agreed to."
      },
      {
        type: 'heading' as const,
        content: "The Public AI Data Flywheel"
      },
      {
        type: 'paragraph' as const,
        content: "Public AI operates a \"data flywheel\" - a system where user interactions help improve AI models for everyone's benefit. This works by:"
      },
      {
        type: 'list' as const,
        content: [
          "Collecting anonymized usage patterns",
          "Identifying common use cases and needs",
          "Using insights to improve model selection and routing",
          "Contributing to open-source model development",
          "Sharing aggregate insights with the research community"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "This flywheel helps create better AI tools for everyone while maintaining privacy and user control."
      },
      {
        type: 'heading' as const,
        content: "Contributing to the Flywheel"
      },
      {
        type: 'paragraph' as const,
        content: "Users can contribute to the flywheel in several ways:"
      },
      {
        type: 'list' as const,
        content: [
          "Using the platform (generates usage insights)",
          "Providing feedback on model performance",
          "Reporting issues or bugs",
          "Suggesting new features or models",
          "Contributing to open-source components"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "All contributions are voluntary and you maintain control over your data participation level."
      },
      {
        type: 'heading' as const,
        content: "Data Processing Pipeline"
      },
      {
        type: 'paragraph' as const,
        content: "Our data processing follows these principles:"
      },
      {
        type: 'list' as const,
        content: [
          "Privacy by design",
          "Minimal data collection",
          "Anonymization before analysis",
          "Secure storage and transmission",
          "Regular data audits and cleanup"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We use industry-standard encryption and security practices to protect your data throughout the processing pipeline."
      },
      {
        type: 'heading' as const,
        content: "Your Rights and Controls"
      },
      {
        type: 'paragraph' as const,
        content: "You have several rights and controls over your data:"
      },
      {
        type: 'list' as const,
        content: [
          "Right to access your data",
          "Right to delete your conversations",
          "Right to opt-out of data collection",
          "Right to data portability",
          "Right to know which providers process your data"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "These controls are available through the platform settings or by contacting our support team."
      },
      {
        type: 'heading' as const,
        content: "Privacy and Security Measures (technical details)"
      },
      {
        type: 'paragraph' as const,
        content: "Our technical security measures include:"
      },
      {
        type: 'list' as const,
        content: [
          "End-to-end encryption for data in transit",
          "Encryption at rest for stored data",
          "Regular security audits and penetration testing",
          "Access controls and authentication",
          "Monitoring and logging for security events",
          "Compliance with relevant data protection regulations"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We follow industry best practices and maintain certifications for data security and privacy protection."
      },
      {
        type: 'heading' as const,
        content: "Legal and Compliance Framework"
      },
      {
        type: 'paragraph' as const,
        content: "Public AI operates under a comprehensive legal and compliance framework:"
      },
      {
        type: 'list' as const,
        content: [
          "GDPR compliance for EU users",
          "CCPA compliance for California users",
          "SOC 2 Type II certification",
          "Regular legal reviews of data practices",
          "Transparent privacy policies",
          "User consent mechanisms"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We work with legal experts to ensure our practices meet the highest standards for data protection and user rights."
      },
      {
        type: 'heading' as const,
        content: "Contact and Support"
      },
      {
        type: 'paragraph' as const,
        content: "For questions about data usage, privacy, or any other concerns:"
      },
      {
        type: 'list' as const,
        content: [
          "Email: support@publicai.co",
          "Privacy inquiries: privacy@publicai.co",
          "Security issues: security@publicai.co",
          "General feedback: feedback@publicai.co"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We aim to respond to all inquiries within 24 hours during business days."
      },
      {
        type: 'heading' as const,
        content: "Benefits of Participation"
      },
      {
        type: 'paragraph' as const,
        content: "By participating in the Public AI ecosystem, you contribute to:"
      },
      {
        type: 'list' as const,
        content: [
          "Advancing open-source AI development",
          "Improving AI accessibility for everyone",
          "Supporting research and education",
          "Building more transparent AI systems",
          "Creating better tools for the global community"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Your participation helps create a more open, accessible, and beneficial AI ecosystem for everyone."
      }
    ]
  };

  return <Article {...articleData} />;
}