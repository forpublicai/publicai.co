// News metadata and utilities
export interface NewsItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  alt: string;
  featured?: boolean;
}

// Function to dynamically get news items by importing their metadata
export const getNewsItems = async (): Promise<NewsItem[]> => {
  // Define the news items we want to load
  const newsItemConfigs = [
    { slug: 'apertus', featured: true },
    { slug: 'amazon' },
    { slug: 'huggingface' },
    { slug: 'airbus' },
    { slug: 'utility' },
    { slug: 'open-source-win'}
  ];

  const newsItems: NewsItem[] = [];

  for (const config of newsItemConfigs) {
    try {
      const mdxModule = await import(`../app/stories/${config.slug}/page.mdx`);
      newsItems.push({
        slug: config.slug,
        ...mdxModule.metadata,
        featured: config.featured || false
      });
    } catch (error) {
      console.warn(`Failed to load metadata for news item: ${config.slug}`, error);
    }
  }

  // Sort by date (newest first)
  return newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get featured news items
export const getFeaturedNewsItems = async (): Promise<NewsItem[]> => {
  const allNews = await getNewsItems();
  return allNews.filter(item => item.featured);
};

// Get non-featured news items
export const getRegularNewsItems = async (): Promise<NewsItem[]> => {
  const allNews = await getNewsItems();
  return allNews.filter(item => !item.featured);
};