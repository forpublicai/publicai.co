import Article from "@/components/Article";

export default function AboutPage() {
  const articleData = {
    title: "About us",
    subtitle: "We build public AI.",
    date: "September 1, 2025",
    sections: [
      {
        type: 'image' as const,
        content: "/team.jpg",
        className: "float-right ml-6 mb-4 w-64 h-auto rounded-lg"
      },
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is a nonprofit, open-source project. Our team builds products and organizes advocacy to support the work of public AI model builders like the Swiss AI Initiative, AI Singapore, AI Sweden, and the Barcelona Supercomputing Center."
      },
      {
        type: 'paragraph' as const,
        content: "We believe in public AI—AI as public infrastructure like highways, water, or electricity. Think of a BBC for AI, a public utility for AI, or public libraries for AI."
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            Our team is fiscally sponsored by <a href="https://metagov.org" className="text-blue-600 hover:text-blue-800 underline">Metagov</a> and funded by Mozilla, the Future of Life Institute, and the Center for Cultural Innovation.
          </>
        )
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            We are part of the global movement for public AI. Take a look at our sister project, the <a href="https://publicai.network" className="text-blue-600 hover:text-blue-800 underline">Public AI Network</a>.
          </>
        )
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            Consider <a href="https://publicai.co/contributing" className="text-blue-600 hover:text-blue-800 underline">joining us</a> or supporting our work <a href="http://opencollective.com/publicai" className="text-blue-600 hover:text-blue-800 underline">with a donation</a>.
          </>
        )
      },
      {
        type: 'heading' as const,
        content: "Get in touch"
      },
      {
        type: 'paragraph' as const,
        content: (
          <>
            Questions? Contact us at <a href="mailto:hello@publicai.co" className="text-blue-600 hover:text-blue-800 underline">hello@publicai.co</a>.
          </>
        )
      },
      {
        type: 'heading' as const,
        content: "Quote wall"
      },
      {
        type: 'list' as const,
        content: [
          '"We’re three toddlers in a trench coat, and that is awesome!" - <a href="https://www.katherinelgorman.com/" class="text-blue-600 hover:text-blue-800 underline">Katherine</a>',
          '"Okay, why don’t we just build this [feature/product/startup] in the next hour?" - <a href="https://joshuatan.com/research" class="text-blue-600 hover:text-blue-800 underline">Josh</a>',
          '"... who built this? 😒" - <a href="https://jennyfan.com/" class="text-blue-600 hover:text-blue-800 underline">Jenny</a>',
          '[While demoing the app] "Oh, I’m actually on a run right now." - <a href="https://www.linkedin.com/in/joseph-low-bc/" class="text-blue-600 hover:text-blue-800 underline">Joseph</a>',
          '"Is this like ChatGPT but vegan/fairtrade/organic?" - <a href="https://www.nickmvincent.com/" class="text-blue-600 hover:text-blue-800 underline">Nick</a>',
          '"Eat some shit, I love you." - <a href="http://linkedin.com/in/alex-kj?originalSubdomain=uk" class="text-blue-600 hover:text-blue-800 underline">Alex</a>',
          '"We’re the best supporting actress for Swiss AI’s launch, and that can be a luxury." - <a href="https://www.katherinelgorman.com/" class="text-blue-600 hover:text-blue-800 underline">Katherine</a> (she has the best quotes)'
        ]
      }
    ]
  };

  return <Article {...articleData} />;
}