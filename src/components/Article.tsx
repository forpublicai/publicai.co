import Link from "next/link";
import Image from "next/image";
import CallToAction from "./CallToAction";
import Footer from "./Footer";

interface ArticleSection {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'html' | 'quote';
  content: string | string[] | React.ReactNode;
  className?: string;
  attribution?: string;
}

interface ArticleProps {
  title: string;
  subtitle: string;
  date: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  sections: ArticleSection[];
}

export default function Article({ title, subtitle, date, heroImage, sections }: ArticleProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="px-6 py-12 max-w-4xl mx-auto">
        <div className="text-sm text-gray-500 mb-4">{date}</div>
        <h1 className="text-5xl font-normal text-black mb-8 leading-tight">
          {title}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          {subtitle}
        </p>
      </header>

      {/* Hero Image */}
      {heroImage && (
        <div className="px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <Image 
              src={heroImage.src}
              alt={heroImage.alt}
              width={800}
              height={400}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="px-6 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          {sections.map((section, index) => {
            switch (section.type) {
              case 'heading':
                return (
                  <h2 key={index} className="text-2xl font-medium text-black mb-4">
                    {section.content}
                  </h2>
                );
              case 'paragraph':
                return (
                  <p key={index} className={`text-gray-700 mb-6 leading-relaxed ${section.className || ''}`}>
                    {typeof section.content === 'string' ? section.content : section.content}
                  </p>
                );
              case 'list':
                return (
                  <ul key={index} className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                    {Array.isArray(section.content) && section.content.map((item, itemIndex) => (
                      <li 
                        key={itemIndex}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                );
              case 'image':
                return (
                  <div key={index} className={`mb-8 ${section.className || ''}`}>
                    <Image 
                      src={section.content as string}
                      alt={`Article image ${index + 1}`}
                      width={800}
                      height={400}
                      className={section.className ? "rounded-lg" : "w-full rounded-lg"}
                    />
                  </div>
                );
              case 'html':
                return (
                  <div 
                    key={index} 
                    className={`mb-6 ${section.className || ''}`}
                    dangerouslySetInnerHTML={{ __html: section.content as string }}
                  />
                );
              case 'quote':
                return (
                  <blockquote key={index} className={`border-l-4 border-gray-300 pl-6 py-4 mb-8 italic text-gray-700 text-lg ${section.className || ''}`}>
                    <p className="mb-2">&ldquo;{section.content}&rdquo;</p>
                    {section.attribution && (
                      <footer className="text-sm text-gray-500 not-italic">
                        — {section.attribution}
                      </footer>
                    )}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>
      </article>

      {/* Call to Action Section */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
}
