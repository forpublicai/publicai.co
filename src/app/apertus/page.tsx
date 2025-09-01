import Article from "@/components/Article";

export default function ApertusSwissAIPage() {
  const articleData = {
    title: "With love, from Switzerland",
    subtitle: "Imanol's team just launched Apertus, the most powerful open-source language model ever released by a public institution.",
    date: "September 1, 2025",
    heroImage: {
      src: "/switzerland.png",
      alt: "With love, from Switzerland"
    },
    sections: [
      {
        type: 'paragraph' as const,
        content: "On August 30, 2025, the Swiss AI Initiative—a collaboration between EPFL, ETH Zurich, and the Swiss National Supercomputing Centre (CSCS)—released Apertus, the country's first large-scale open language model. Built with Swiss values in mind—transparency, multilingual capabilities, and public service—Apertus is a fully open-source foundation model released in two versions under the Apache 2.0 license."
      },
      {
        type: 'paragraph' as const,
        content: "It is now one of the most powerful multilingual LLMs ever released by a public institution—and it's available to everyone through the Public AI reference Utility."
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://chat.publicai.co/" class="text-blue-600 hover:text-blue-800 underline">Chat with Apertus now</a>',
          '<a href="https://www.apertus.ai/" class="text-blue-600 hover:text-blue-800 underline">Visit apertus.ai</a>', 
          '<a href="https://docs.google.com/document/d/1T6TprlE90ovr30OGxCdPHZ_BDgua-aHfrZDpdydwIP0/edit?tab=t.0#heading=h.slzksvsbviv0" class="text-blue-600 hover:text-blue-800 underline">Press release</a>'
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Public AI is proud to be the official international deployment partner for Apertus."
      },
      {
        type: 'heading' as const,
        content: "Openness by design"
      },
      {
        type: 'paragraph' as const,
        content: "The name \"Apertus\" comes from Latin, meaning open. That's not just branding—it's the core principle."
      },
      {
        type: 'paragraph' as const,
        content: 'Everything about the model is transparent and reproducible:'
      },
      {
        type: 'list' as const,
        content: [
          'the training architecture, datasets, and recipes',
          'the model weights, including intermediate checkpoints',
          'the source code, logs, and deployment guides'
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Unlike models that offer partial access, Apertus is fully inspectable and modifiable, giving developers, researchers, and institutions complete visibility into how the model was built and how it behaves. This approach sets a new bar for trustworthiness and reproducibility in AI systems."
      },
      {
        type: 'paragraph' as const,
        content: 'Apertus is built for the public good," says Imanol Schlag, technical lead at ETH Zurich. "It is the first of its kind to embody multilingualism, transparency, and compliance as foundational design principles."'
      },
      {
        type: 'heading' as const,
        content: "Multilingual and inclusive"
      },
      {
        type: 'paragraph' as const,
        content: "Apertus is trained on 15 trillion tokens across more than 1500 languages, with 40% of the training data in non-English languages. That includes Swiss languages like Romansh and German, as well as many others historically underrepresented in mainstream LLMs."
      },
      {
        type: 'paragraph' as const,
        content: "This is a significant step forward in linguistic diversity. Apertus isn't just another English-first model with some multilingual additions—it's designed from the ground up to serve users and communities across linguistic boundaries."
      },
      {
        type: 'heading' as const,
        content: "Transparency meets compliance"
      },
      {
        type: 'paragraph' as const,
        content: "Alongside the release, the Apertus team has shared documentation addressing legal and ethical considerations. The training corpus is made from publicly available data only, and filtered to:"
      },
      {
        type: 'paragraph' as const,
        content: "The complete openness of the model means no hidden training data, no undisclosed biases, and no proprietary components that could create compliance risks down the line."
      },
      {
        type: 'heading' as const,
        content: "Research-grade, industry-ready"
      },
      {
        type: 'paragraph' as const,
        content: "Apertus is designed for both research and real-world applications. The 70B model delivers cutting-edge performance and is ideal for deployment at scale. The 8B version offers fast performance and lower resource requirements, suitable for fine-tuning or local use. Under the Apache 2.0 license, both models can be used for:"
      },
      {
        type: 'list' as const,
        content: [
          'Research and education',
          'Commercial applications',
          'Translation, summarization, chatbots, tutoring systems, and more'
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Swisscom is already offering Apertus through its sovereign Swiss AI platform, with dedicated access for Swiss {ai} Weeks hackathon participants. Business customers can deploy it through Swisscom infrastructure today."
      },
      {
        type: 'heading' as const,
        content: "A foundation for innovation"
      },
      {
        type: 'paragraph' as const,
        content: "Apertus isn't just a model drop—it's the beginning of a new institutional approach to AI. The Swiss AI Initiative sees Apertus as a foundation on which developers, researchers, and public institutions can build together."
      },
      {
        type: 'paragraph' as const,
        content: '"This is not a conventional case of tech transfer from lab to product," says Thomas Schulthess, Director of CSCS. "Apertus is a driver of innovation—designed to strengthen AI expertise across research, society, and industry."'
      },
      {
        type: 'paragraph' as const,
        content: 'The development was powered by over 10 million GPU hours on the new Alps supercomputer at CSCS, and funded by the ETH Board, with support from partners including Swisscom.'
      },
      {
        type: 'heading' as const,
        content: "Try Apertus now"
      },
      {
        type: 'paragraph' as const,
        content: "If you're in Switzerland, you can try Apertus through Swisscom or during Swiss {ai} Weeks events. If you're outside Switzerland - or just curious - Public AI is making Apertus available globally through the Public AI Inference Utility."
      },
      {
        type: 'paragraph' as const,
        content: '"Apertus is the leading public AI model today," says Joshua Tan, Lead Maintainer of the Utility. "It\'s our best proof yet that AI can be a form of public infrastructure—like highways, water, or electricity."'
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://chat.publicai.co/" class="text-blue-600 hover:text-blue-800 underline">Chat with Apertus</a>',
          '<a href="https://publicai.co/utility" class="text-blue-600 hover:text-blue-800 underline">Run your own instance</a>'
        ]
      },
      {
        type: 'heading' as const,
        content: "Where it goes next"
      },
      {
        type: 'paragraph' as const,
        content: "This is just the beginning. The Swiss AI Initiative has committed to regular updates of Apertus, and to exploring domain-specific models in areas like law, climate, health, and education. Future releases will expand capabilities while maintaining the same core values: openness, compliance, and public purpose."
      },
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility will continue to bring Apertus to the world. We extend an open invitation to other countries, public institutions, and research communities to join us in shaping the next chapter. Apertus proves that large-scale, transparent, multilingual AI—developed for the public interest—is possible. Let's build on this momentum. Whether you're designing national AI strategies, managing public compute infrastructure, or stewarding open science, we welcome collaborators to work with us on future Apertus-scale efforts that reflect shared democratic values and serve global public needs."
      },
      {
        type: 'quote' as const,
        content: "This release isn't a final step—it's a beginning. We're building toward a long-term commitment to sovereign, open AI foundations that serve the public good, worldwide",
        attribution: "Antoine Bosselut, Co-Lead of the Swiss AI Initiative"
      },
      {
        type: 'heading' as const,
        content: "Explore Apertus"
      },
      {
        type: 'paragraph' as const,
        content: "The age of public AI has a flagship model. Its name is Apertus. Let\'s build with it."
      },
      {
        type: 'list' as const,
        content: [
          'Main site: <a href="https://www.apertus.ai/" class="text-blue-600 hover:text-blue-800 underline">Apertus.ai</a>',
          'Documentation + models: <a href="https://huggingface.co/Apertus-LLM" class="text-blue-600 hover:text-blue-800 underline">Hugging Face: Apertus</a>',
          'Try online: <a href="https://chat.publicai.co/" class="text-blue-600 hover:text-blue-800 underline">chat.publicai.co</a>'
        ]
      }
    ]
  };

  return <Article {...articleData} />;
}