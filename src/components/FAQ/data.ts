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
    question: "What's your roadmap?",
    answer: "Look at https://github.com/orgs/forpublicai/projects/2."
  },
  {
    question: "How do I delete my account?",
    answer: "There's no option to delete an account anywhere in the settings.\nOpenWebUI does not yet have a feature for automatically deleting accounts, so we have to do it manually. Just email support@publicai.co with the title \"Delete my account\" and we will erase your account and all associated data in our databases."
  },
  {
    question: "AWS has donated compute, you write. Does that mean that if I use Apertus my data is stored in an AWS cloud? What other role does AWS have?",
    answer: "Yes, if you use Apertus right now, the data is stored in an AWS cluster located in Zurich. Note, we have multiple compute providers providing GPUs that support the inference load for Apertus. These servers that run the GPUs do not store any data and are only used for inference. Separately, we also use AWS for some of our general compute needs, including our user database. We'll put out a FAQ shortly going into the details of our deployment... and encouraging people to help out if they want to change it!"
  },
  {
    question: "What kind of privacy guarantees do I have?",
    answer: "AWS privacy guarantees are strong enough that this is very close to us running it on a box in our basement (https://aws.amazon.com/compliance/data-privacy-faq/, ref. \"We do not access or use your content for any purpose without your agreement.\")"
  },
  {
    question: "Do you have any link with publicai.io and their crypto coin or publicai.com?",
    answer: "We have absolutely no connection to publicai.io or publicai.com."
  },
  {
    question: "I don't see any environmental objectives on your website. I understand it's not your primary concern, but was wondering what steps, if any, you take to minimize your environmental footprint.",
    answer: "While we don't explicitly optimize for emissions in our code or resource orchestration, our mission fundamentally supports better resource allocation than private actors operating independently. Our consortium approach is specifically designed to minimize excessive duplication that comes from competition between private actors—rather than each company building redundant infrastructure, we coordinate shared resources. In practice, we coordinate donated GPUs from many different sources, so environmental aspects are handled by our inference partners, some of whom do focus explicitly on environmental footprint (e.g., Exoscale)."
  }
];