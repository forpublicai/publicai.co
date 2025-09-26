import Link from "next/link";
import Image from "next/image";
import { getNewsItems } from "@/lib/stories";

export default async function StoriesPage() {
  const newsItems = await getNewsItems();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-normal text-black mb-4 leading-tight">
            Stories
          </h1>
          <p className="text-lg text-gray-600">
            Latest updates and insights from Public AI
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Link key={item.slug} href={`/stories/${item.slug}`} className="block">
              <div className="hover:opacity-80 transition-opacity cursor-pointer">
                {/* Image */}
                <div className="aspect-[4/3] bg-pink-100 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-medium text-black leading-tight mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500">{item.date}</p>
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}