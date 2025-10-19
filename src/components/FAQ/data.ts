export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "Is Public AI a foundation model or did you build Public AI on top of existing foundation models like Llama, Mistral, DeepSeek?",
    answer: "The Public AI Inference Utility is not a foundation model; it's an open deployment service intended to make public and sovereign AI models more accessible to citizens. Right now, we serve Apertus (from Switzerland) and SEA-LION v4 (from Singapore)."
  },
  {
    question: "How can I get involved?",
    answer: "For individuals, take a look at [our contributing page](https://publicai.co/contributing). For organizations, take a look at [our inference partner page](https://publicai.co/contributing/inference-partners), or [our model partner page](https://publicai.co/contributing/model-partners)."
  },
  {
    question: "Do you have more technical information about the model and setup? Like how big the context window actually is.",
    answer: "We've currently set these sampling parameters: \nMax tokens: 8,192 tokens\ntemperature: 0.8 (recommended by swiss-ai)\ntop_p: 0.9 (recommended by swiss-ai)."
  },
  {
    question: "What's your roadmap?",
    answer: "Look at [our roadmap on GitHub](https://github.com/orgs/forpublicai/projects/2)."
  },
  {
    question: "How do I delete my account?",
    answer: "There's no option to delete an account anywhere in the settings yet. Our frontend stack, OpenWebUI, does not yet have a feature for automatically deleting accounts, so we have to do it manually. For now, just email support@publicai.co with the subject \"Delete my account\" and we will erase your account and all associated data in our databases."
  },
  {
    question: "Where is my data processed and stored?",
    answer: "If you use the Public AI Inference Utility right now, the data is stored in an Amazon Web Services (AWS) cluster located in Zurich, Switzerland. We have multiple compute providers all over the world that provide GPUs that support the processing of queries for Apertus, SEA-LION, and the other models we support. These servers that run the GPUs do not store any data and are only used for inference. Separately, we also use AWS for some of our general compute needs, including our user database. We'll put out more details shortly going into the details of our deployment... and encouraging people to help out if they want to change it!"
  },
  {
    question: "What kind of privacy guarantees do I have?",
    answer: "Take a look at [our terms and conditions](https://publicai.co/tc). On a technical level, AWS privacy guarantees are strong enough that this is very close to us running it on a box in our basement (https://aws.amazon.com/compliance/data-privacy-faq/, ref. \"We do not access or use your content for any purpose without your agreement.\")"
  },
  {
    question: "Do you have any link with publicai.io and their crypto coin or publicai.com?",
    answer: "We have absolutely no connection to publicai.io or publicai.com."
  },
  {
    question: "I don't see any environmental objectives on your website. I understand it's not your primary concern, but was wondering what steps, if any, you take to minimize your environmental footprint.",
    answer: "While we don't explicitly optimize for emissions in our code or resource orchestration, our mission fundamentally supports better resource allocation than private actors operating independently. Our consortium approach is specifically designed to minimize excessive duplication that comes from competition between private actors—rather than each company building redundant infrastructure, we coordinate shared resources. In practice, we coordinate donated GPUs from many different sources, so environmental aspects are handled by our inference partners, some of whom do focus explicitly on environmental footprint (e.g., Exoscale)."
  },
  {
    question: "I'm a researcher. How can I get access to your data?",
    answer: "We're happy to share our data—subject to our [terms and conditions](/tc)—with researchers who are interested in studying the impact of public AI on society. We are particularly interested in working with researchers who can help us make the data from our platform more accessible to the public. Please contact us at hello@publicai.co to learn more."
  },
  {
    question: "What is Public AI Plus?",
    answer: "Public AI Plus (or Public AI+) is a way for users to publish tools directly to our platform's shared frontend. It also facilitates data contributions to the public AI commons."
  }
];