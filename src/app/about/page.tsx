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
        content: "Public AI is a nonprofit organization dedicated to building artificial intelligence infrastructure that serves the public interest. We develop open models, public compute resources, and governance frameworks that ensure AI benefits everyone, not just a privileged few."
      },
      {
        type: 'paragraph' as const,
        content: "Our work spans three core areas:"
      },
      {
        type: 'list' as const,
        content: [
          "Open Models: We develop and deploy state-of-the-art AI models that are fully transparent and freely available",
          "Public Infrastructure: We build compute and deployment infrastructure that reduces dependence on commercial providers",
          "Democratic Governance: We create frameworks that ensure AI development reflects democratic values and serves the common good"
        ]
      },
      {
        type: 'paragraph' as const,
        content: "We believe that artificial intelligence is too important to be left entirely to private markets. Like roads, power grids, and communication networks, AI infrastructure should be a public good."
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
        content: "Public AI is supported by grants, donations, and partnerships with institutions that share our vision. We're committed to transparency in our funding, governance, and technical development."
      },
      {
        type: 'paragraph' as const,
        content: "Want to get involved? We're always looking for researchers, engineers, policymakers, and advocates who want to help build the future of public AI. Visit our contributing page or reach out directly."
      },
      {
        type: 'list' as const,
        content: [
          '<a href="https://publicai.co/contributing" class="text-blue-600 hover:text-blue-800 underline">Contributing</a>',
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