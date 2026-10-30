export interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  country: string;
  licenseType: "Open Source" | "Open Weights";
  licenseName: string;
  modalities: ("Text" | "Vision" | "Reasoning" | "Tools")[];
  contextLength: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  details: string;
}

export const MODEL_CATALOG: ModelEntry[] = [
  {
    id: "swiss-ai/apertus-v1.5-70b",
    name: "Apertus 1.5 70B",
    provider: "Swiss AI (EPFL · ETH Zurich · CSCS)",
    country: "Switzerland",
    licenseType: "Open Source",
    licenseName: "Apache 2.0 (Open Data & Recipes)",
    modalities: ["Text", "Vision", "Tools"],
    contextLength: "262K",
    inputPricePerMillion: 0.82,
    outputPricePerMillion: 2.92,
    details:
      "Flagship 70B Apertus v1.5 model. Fully open weights, training data, and recipes under the Apertus Charter. Supports multimodal image + text inputs, 262,144-token context, and tool calling across 1,500+ languages.",
  },
  {
    id: "swiss-ai/apertus-v1.5-70b-thinking",
    name: "Apertus 1.5 70B Thinking",
    provider: "Swiss AI (EPFL · ETH Zurich · CSCS)",
    country: "Switzerland",
    licenseType: "Open Source",
    licenseName: "Apache 2.0 (Open Data & Recipes)",
    modalities: ["Text", "Vision", "Reasoning", "Tools"],
    contextLength: "262K",
    inputPricePerMillion: 0.82,
    outputPricePerMillion: 2.92,
    details:
      "70B Apertus v1.5 with extended step-by-step reasoning mode enabled. Ideal for complex scientific, policy, legal, and multi-step analytical tasks.",
  },
  {
    id: "swiss-ai/apertus-v1.5-8b",
    name: "Apertus 1.5 8B",
    provider: "Swiss AI (EPFL · ETH Zurich · CSCS)",
    country: "Switzerland",
    licenseType: "Open Source",
    licenseName: "Apache 2.0 (Open Data & Recipes)",
    modalities: ["Text", "Vision", "Tools"],
    contextLength: "262K",
    inputPricePerMillion: 0.1,
    outputPricePerMillion: 0.2,
    details:
      "Fast, cost-effective 8B Apertus v1.5 model with multimodal vision support, 262K context window, and strong instruction-following. Recommended default for low-latency production apps.",
  },
  // {
  //   id: "swiss-ai/apertus-v1.5-8b-thinking",
  //   name: "Apertus 1.5 8B Thinking",
  //   provider: "Swiss AI (EPFL · ETH Zurich · CSCS)",
  //   country: "Switzerland",
  //   licenseType: "Open Source",
  //   licenseName: "Apache 2.0 (Open Data & Recipes)",
  //   modalities: ["Text", "Vision", "Reasoning", "Tools"],
  //   contextLength: "262K",
  //   inputPricePerMillion: 0.1,
  //   outputPricePerMillion: 0.2,
  //   details:
  //     "8B Apertus v1.5 with extended reasoning mode enabled. Combines compact 8B latency and pricing with structured chain-of-thought deliberation.",
  // },
  {
    id: "aisingapore/Gemma-SEA-LION-v4-27B-IT",
    name: "Gemma SEA-LION v4 27B IT",
    provider: "AI Singapore",
    country: "Singapore",
    licenseType: "Open Weights",
    licenseName: "Gemma License",
    modalities: ["Text", "Vision"],
    contextLength: "128K",
    inputPricePerMillion: 0.2,
    outputPricePerMillion: 0.4,
    details:
      "Instruction-tuned for Southeast Asian languages including English, Mandarin, Vietnamese, Indonesian, Thai, Tagalog, Tamil, Malay, Khmer, Lao, and Burmese with vision comprehension.",
  },
  {
    id: "aisingapore/Qwen-SEA-LION-v4-32B-IT",
    name: "Qwen SEA-LION v4 32B IT",
    provider: "AI Singapore",
    country: "Singapore",
    licenseType: "Open Weights",
    licenseName: "Apache 2.0",
    modalities: ["Text", "Reasoning", "Tools"],
    contextLength: "128K",
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 0.5,
    details:
      "32B instruction-tuned SEA-LION model built on Qwen3. Optimized for Southeast Asian languages, regional reasoning, and multilingual enterprise tasks.",
  },
  {
    id: "aisingapore/Nemotron-SEA-LION-v4.8-120B-A12B",
    name: "Nemotron SEA-LION v4.8 120B A12B",
    provider: "AI Singapore",
    country: "Singapore",
    licenseType: "Open Weights",
    licenseName: "NVIDIA Open Model License",
    modalities: ["Text", "Reasoning", "Tools"],
    contextLength: "262K",
    inputPricePerMillion: 0.5,
    outputPricePerMillion: 2.0,
    details:
      "Flagship 120B parameter (12B active) Mixture-of-Experts foundation model built by AI Singapore in collaboration with NVIDIA. Features a 262K context window and specialized linguistic and cultural understanding for 11 Southeast Asian languages including Indonesian, Malay, Thai, Vietnamese, Tagalog, Burmese, Tamil, and English.",
  },
  {
    id: "speakleash/Bielik-11B-v3.0-Instruct",
    name: "Bielik 11B v3.0 Instruct",
    provider: "SpeakLeash & ACK Cyfronet AGH",
    country: "Poland",
    licenseType: "Open Weights",
    licenseName: "Apache 2.0",
    modalities: ["Text", "Tools"],
    contextLength: "32K",
    inputPricePerMillion: 0.4,
    outputPricePerMillion: 0.4,
    details:
      "11B sovereign European model trained on 32 European languages with emphasis on Polish. Excels at European language understanding, logic, STEM, and tool use.",
  },
  {
    id: "allenai/Olmo-3-7B-Instruct",
    name: "OLMo 3 7B Instruct",
    provider: "Allen Institute for AI (Ai2)",
    country: "United States",
    licenseType: "Open Source",
    licenseName: "Apache 2.0 (Open Data & Code)",
    modalities: ["Text", "Tools"],
    contextLength: "65K",
    inputPricePerMillion: 0.1,
    outputPricePerMillion: 0.2,
    details:
      "Fully open-source 7B model from the Allen Institute for AI with open weights, open training data (Dolma), and open evaluation code.",
  },
  {
    id: "BSC-LT/ALIA-40b",
    name: "ALIA 40B",
    provider: "Barcelona Supercomputing Center (BSC)",
    country: "Spain",
    licenseType: "Open Source",
    licenseName: "Apache 2.0",
    modalities: ["Text"],
    contextLength: "65K",
    inputPricePerMillion: 0.35,
    outputPricePerMillion: 0.7,
    details:
      "Spain's public foundation model family trained at the Barcelona Supercomputing Center across Spanish, Catalan, Basque, Galician, and European languages.",
  },
  {
    id: "utter-project/EuroLLM-22B-Instruct-2512",
    name: "EuroLLM 22B Instruct",
    provider: "EuroLLM Consortium",
    country: "European Union",
    licenseType: "Open Source",
    licenseName: "Apache 2.0",
    modalities: ["Text"],
    contextLength: "32K",
    inputPricePerMillion: 0.1,
    outputPricePerMillion: 0.2,
    details:
      "22B multilingual model covering all 24 official EU languages plus global languages, trained on European public supercomputing infrastructure.",
  },
  // {
  //   id: "swiss-ai/apertus-70b-instruct",
  //   name: "Apertus 1.0 70B Instruct",
  //   provider: "Swiss AI (EPFL · ETH Zurich · CSCS)",
  //   country: "Switzerland",
  //   licenseType: "Open Source",
  //   licenseName: "Apache 2.0 (Open Data & Recipes)",
  //   modalities: ["Text"],
  //   contextLength: "65K",
  //   inputPricePerMillion: 0.82,
  //   outputPricePerMillion: 2.92,
  //   details:
  //     "First-generation 70B instruct-tuned Apertus model released in September 2025 under the Apache 2.0 license.",
  // },
  // {
  //   id: "swiss-ai/apertus-8b-instruct",
  //   name: "Apertus 1.0 8B Instruct",
  //   provider: "Swiss AI (EPFL · ETH Zurich · CSCS)",
  //   country: "Switzerland",
  //   licenseType: "Open Source",
  //   licenseName: "Apache 2.0 (Open Data & Recipes)",
  //   modalities: ["Text"],
  //   contextLength: "65K",
  //   inputPricePerMillion: 0.1,
  //   outputPricePerMillion: 0.2,
  //   details:
  //     "First-generation 8B instruct-tuned Apertus model released in September 2025 under the Apache 2.0 license.",
  // },
];
