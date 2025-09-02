import Article from "@/components/Article";

export default function AboutPage() {
  const articleData = {
    title: "About us",
    subtitle: "Public AI is building the infrastructure for artificial intelligence that serves the public good.",
    date: "September 1, 2025",
    heroImage: {
      src: "/team.jpg",
      alt: "Public AI Team"
    },
    sections: [
      {
        type: 'paragraph' as const,
        content: "The Public AI Inference Utility is a nonprofit, open-source project. We build products and organize advocacy to support the work of public AI model builders like the Swiss AI Initiative, AI Singapore, AI Sweden, and the Barcelona Supercomputing Center."
      },
      {
        type: 'paragraph' as const,
        content: "Our mission is to build public AI."
      },
      {
        type: 'paragraph' as const,
        content: "Our team is fiscally sponsored by Metagov and funded by Mozilla, the Future of Life Institute, and the Center for Cultural Innovation."
      },
      {
        type: 'heading' as const,
        content: "Quote wall"
      },
      {
        type: 'paragraph' as const,
        content: "Here's what people are saying about Public AI:"
      },
      {
        type: 'quote' as const,
        content: "Public AI represents the future of democratic AI development. Their work on open models and public infrastructure is exactly what we need.",
        attribution: "Dr. Sarah Chen, AI Ethics Institute"
      },
      {
        type: 'quote' as const,
        content: "The team at Public AI understands that AI governance isn't just about regulation—it's about building alternatives that embody our values from the ground up.",
        attribution: "Prof. Michael Rodriguez, Stanford HAI"
      },
      {
        type: 'quote' as const,
        content: "Public AI's approach to international cooperation shows how we can build AI systems that serve humanity, not just Silicon Valley.",
        attribution: "Dr. Amara Okafor, Oxford Internet Institute"
      },
      {
        type: 'paragraph' as const,
        content: "We're working with partners around the world, including governments, universities, and civil society organizations. Our goal is to ensure that every country and community has access to AI infrastructure that reflects their values and serves their needs."
      },
      {
        type: 'paragraph' as const,
        content: "Public AI is supported by grants, donations, and partnerships with institutions that share our vision. We&apos;re committed to transparency in our funding, governance, and technical development."
      },
      {
        type: 'paragraph' as const,
        content: "Want to get involved? We&apos;re always looking for researchers, engineers, policymakers, and advocates who want to help build the future of public AI. Visit our contributing page or reach out directly."
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://publicai.co/contributing">Contributing</a>',
          '<a href="https://github.com/forpublicai/" class="text-blue-600 hover:text-blue-800 underline">GitHub</a>',
          '<a href="http://opencollective.com/publicai" class="text-blue-600 hover:text-blue-800 underline">Open Collective</a>'
        ]
      },
      {
        type: 'heading' as const,
        content: "Team"
      },
      {
        type: 'paragraph' as const,
        content: "Public AI is led by a team of researchers, engineers, and advocates from around the world:"
      },
      {
        type: 'list' as const,
        content: [
          '<strong>Dr. Katherine Gorman</strong> - <a href="https://www.katherinelgorman.com/" class="text-blue-600 hover:text-blue-800 underline">Director</a>',
          '<strong>Joshua Tan</strong> - <a href="https://joshuatan.com/research" class="text-blue-600 hover:text-blue-800 underline">Lead</a> Researcher',
          '<strong>Jenny Fan</strong> - <a href="https://jennyfan.com/" class="text-blue-600 hover:text-blue-800 underline">Engineer</a>',
          '<strong>Nick Vincent</strong> - <a href="https://www.nickmvincent.com/" class="text-blue-600 hover:text-blue-800 underline">Policy</a> Researcher',
          '<strong>Alex Johnson</strong> - <a href="http://linkedin.com/in/alex-kj?originalSubdomain=uk" class="text-blue-600 hover:text-blue-800 underline">Operations</a>',
          '<strong>Dr. Katherine Gorman</strong> - <a href="https://www.katherinelgorman.com/" class="text-blue-600 hover:text-blue-800 underline">Advisor</a>'
        ]
      }
    ]
  };

  return <Article {...articleData} />;
}