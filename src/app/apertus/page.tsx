import Article from "@/components/Article";

export default function ApertusSwissAIPage() {
  const articleData = {
    title: "With love, from Switzerland",
    subtitle: "Imanol's team just launched Apertus, the most powerful open-source language model ever released by a public institution.",
    date: "September 2, 2025",
    heroImage: {
      src: "/switzerland.png",
      alt: "With love, from Switzerland"
    },
    sections: [
      {
        type: 'paragraph' as const,
        content: "On September 2, 2025, the Swiss AI Initiative—a collaboration between EPFL, ETH Zurich, and the Swiss National Supercomputing Centre (CSCS)—released Apertus, the country's first large-scale open language model. Built with Swiss values in mind—transparency, multilingual capabilities, and public service—Apertus is a fully open-source foundation model released in two versions (8B and 70B) under the Apache 2.0 license."
      },
      {
        type: 'paragraph' as const,
        content: "It is now one of the most powerful multilingual LLMs ever released by a public institution—and it's available to everyone through the Public AI reference Utility."
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://chat.publicai.co/" class="text-blue-600 hover:text-blue-800 underline">Chat with Apertus now</a>',
          'Docs + models <a href="https://huggingface.co/swiss-ai" class="text-blue-600 hover:text-blue-800 underline">on Hugging Face</a>',
          '<a href="https://docs.google.com/document/d/e/2PACX-1vTgz5MtSPUSZ8lFavarM0Mti42KdOiYH5WynlD1uLO0eDM2LGaGtn2ST-UuE4B-s3sdv1ghEIiWm90t/pub" class="text-blue-600 hover:text-blue-800 underline">Press release</a>'
        ]
      },
      {
        type: 'paragraph' as const,
        content: "Public AI is proud to be the official international deployment partner for Apertus. To support Apertus, we've allocated over 115,000 GPU-hours spread across 20 clusters in 5+ countries—just for the month of September. For reference, that’s a Geneva-sized amount of inference: about what a city the size of Geneva spends on consumer compute per month. This was made possible by our inference partners, including Amazon Web Services, Exoscale, AI Singapore, Cudo Compute, the Swiss National Supercomputing Centre (CSCS), and many others."
      },
      {
        type: 'heading' as const,
        content: "Openness by design"
      },
      {
        type: 'paragraph' as const,
        content: "The name \"Apertus\" comes from Latin, meaning open. Everything about the model is transparent and reproducible:"
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
        content: "Unlike models that offer partial access, Apertus is fully inspectable and modifiable, giving developers, researchers, and institutions complete visibility into how the model was built and how it behaves."
      },
      {
        type: 'paragraph' as const,
        content: '"Apertus is built for the public good," says Imanol Schlag, technical lead of Apertus and a research scientist at ETH Zurich. "It stands among the few fully open LLMs at this scale and is the first of its kind to embody multilingualism, transparency, and compliance as foundational design principles."'
      },
      {
        type: 'heading' as const,
        content: "Multilingual and inclusive"
      },
      {
        type: 'paragraph' as const,
        content: "Apertus is trained on 15 trillion tokens across more than 1500 languages, with 40% of the training data in non-English languages. That includes Swiss languages like Romansh and German, as well as many others historically underrepresented in mainstream, private LLMs."
      },
      {
        type: 'paragraph' as const,
        content: "This is a significant step forward in linguistic diversity. Apertus isn't just another English-first model with some multilingual additions—it's designed from the ground up to serve users and communities across linguistic boundaries."
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
        type: 'heading' as const,
        content: "Try Apertus now"
      },
      {
        type: 'paragraph' as const,
        content: "If you're in Switzerland, you can try Apertus through Swisscom or during Swiss {ai} Weeks events. If you're outside Switzerland—or just curious—you can try Apertus right here, through the Public AI Inference Utility."
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://chat.publicai.co/" class="text-blue-600 hover:text-blue-800 underline">Chat with Apertus</a>',
          '<a href="https://huggingface.co/swiss-ai" class="text-blue-600 hover:text-blue-800 underline">Run your own instance</a>'
        ]
      },
      {
        type: 'heading' as const,
        content: "Where it goes next"
      },
      {
        type: 'paragraph' as const,
        content: "This is just the beginning. The Swiss AI Initiative will continue to make regular updates to Apertus, exploring domain-specific models in areas like law, climate, health, and education. Future releases will expand capabilities while maintaining the same core values: openness, excellence, and public purpose."
      },
      {
        type: 'quote' as const,
        content: "This release isn't a final step—it's a beginning. We're building toward a long-term commitment to sovereign, open AI foundations that serve the public good, worldwide.",
        attribution: "Antoine Bosselut, Co-Lead of the Swiss AI Initiative"
      },
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility will continue to bring Apertus to the world. We look forward to supporting more Apertus-scale efforts. We extend an open invitation to other public institutions, research communities, and forward-looking companies to join us in shaping the next chapter of AI."
      }
    ]
  };

  return <Article {...articleData} />;
}