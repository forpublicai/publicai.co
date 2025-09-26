import Link from "next/link";
import Image from "next/image";
import { getFeaturedNewsItems, getRegularNewsItems } from "@/lib/news";
import ChatInterface from "@/components/ChatInterface";

export default async function Home() {
  const featuredNewsItems = await getFeaturedNewsItems();
  const regularNewsItems = await getRegularNewsItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-2 py-24">
        <div className="max-w-3xl mx-auto w-full">
          <h1 className="text-6xl font-normal text-black mb-8 leading-tight text-center">
            Try Apertus
          </h1>

          <p className="text-lg text-gray-600 mb-8 text-center">
            ⛰️
          </p>

          <ChatInterface />
        </div>

        <div className="max-w-5xl mx-auto w-full">
          <p className="text-3xl text-black text-center mt-12 mb-16">
            What if AI were public infrastructure like highways, water, or electricity?
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="px-6 space-y-24">
        {/* Featured News Section */}
        {featuredNewsItems.length > 0 && (
          <section className="max-w-6xl mx-auto">
            {featuredNewsItems.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="block">
                <div className="hover:opacity-95 transition-opacity cursor-pointer">
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Large Featured Image */}
                    <div className="aspect-[3/4] bg-pink-100 rounded-2xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={600}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Featured Text Content */}
                    <div className="space-y-6">
                      <div className="inline-block bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                        FEATURED
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold text-black leading-tight mb-4">{item.title}</h2>
                        <p className="text-sm text-gray-500 mb-6">{item.date}</p>
                      </div>
                      <p className="text-xl text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-4">
                        <span className="inline-flex items-center text-black font-medium hover:underline">
                          Read the full story
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* Latest News Section */}
        <section className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium text-black">Latest news</h2>
            <Link href="/news" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularNewsItems.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="block">
                <div className="hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="grid grid-cols-[1fr_2fr] gap-6 items-start">
                    {/* Smaller Square Image */}
                    <div className="aspect-square bg-pink-100 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-black leading-tight mb-2">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center text-sm text-black font-medium hover:underline">
                          Read more
                          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* About Public AI Section */}
        <section className="max-w-6xl mx-auto">
          {/* Two column header text */}
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-4xl font-bold text-black leading-tight">
              Our mission is to make AI a public infrastructure, accessible to everyone—like highways, water, or electricity. 
              </h2>
            </div>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                We&apos;re a nonprofit building products and organizing advocacy to support public AI model builders worldwide.
              </p>
              <p className="text-lg leading-relaxed">
              We support national labs, open-source communities, and anyone contributing to the public good.
              </p>
            </div>
          </div>

          {/* Two cards */}
          <div className="grid md:grid-cols-2 gap-16">
            {/* About Us Card */}
            <Link href="/about/about-us" className="block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                <Image
                  src="/josh_puppy.jpeg"
                  alt="Public AI Team"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">About Us</h3>
                      <p className="text-sm text-gray-200">Who we are</p>
                    </div>
                    <p className="text-white leading-relaxed">
                      We&apos;re a nonprofit team building the global movement for public AI. Fiscally sponsored by Metagov and funded by Mozilla and others.
                    </p>
                    <span className="inline-flex items-center font-medium hover:underline">
                      Learn about our mission
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Contributing Card */}
            <Link href="/about/contributing" className="block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                <Image
                  src="/community.jpeg"
                  alt="Community"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Get Involved</h3>
                      <p className="text-sm text-gray-200">Help us build AI for everyone</p>
                    </div>
                    <p className="text-white leading-relaxed">
                    It's launched! Now we really need your help. Joseph needs your help building the inference service. Just send PRs – it's all open source.
                    </p>
                    <span className="inline-flex items-center font-medium hover:underline">
                      Start contributing
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

      </div>

      {/* Partners Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-24 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Our partners</h2>
          <p className="text-gray-600">Powered by models and compute from leading institutions and organizations</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 items-center justify-center justify-items-center">
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.swiss-ai.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/swissai.png" 
                alt="Swiss AI" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/aws.png" 
                alt="Amazon Web Services" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.exoscale.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/exoscale.png" 
                alt="Exoscale" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.aisingapore.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/aisingapore.png" 
                alt="AI Singapore" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.cudocompute.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/cudo.png" 
                alt="Cudo Compute"
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.cscs.ch" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/cscs.jpg" 
                alt="Swiss National Supercomputing Centre" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://nci.org.au" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/nciaustralia.png" 
                alt="National Computational Infrastructure Australia" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
          <div className="flex items-center justify-center h-20 w-44">
            <a href="https://www.fz-juelich.de/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/inference_partners/juelich.png" 
                alt="Juelich Supercomputing Center" 
                className="max-h-16 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 mt-16">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-normal text-black leading-tight">
            By the people, for the people
          </h2>
          <p className="text-lg text-gray-600">
            Join the movement to make AI accessible to everyone
          </p>
          <div className="pt-8">
            <a
              href="https://chat.publicai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white text-lg font-medium px-12 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              TRY IT ↗
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-24 mt-16">
          <div className="space-y-16">
            {/* Navigation Links */}
            <div className="flex space-x-12">
              <Link href="/tc" className="text-black hover:text-gray-600 transition-colors text-sm font-medium">
                TERMS & CONDITIONS
              </Link>
              <a href="mailto:hello@publicai.co" className="text-black hover:text-gray-600 transition-colors text-sm font-medium">
                CONTACT US
              </a>
            </div>

            {/* Copyright */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                &copy; Public AI Inference Utility &nbsp;&nbsp; 2025
              </div>
              <div>
                All Rights Reserved
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}