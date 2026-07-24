import type { Metadata } from 'next';

interface StoryMetadataInput {
  title: string;
  description: string;
  date: string;
  image: string;
  alt: string;
  ogImage?: string;
}

export function createStoryMetadata({
  title,
  description,
  date,
  image,
  alt,
  ogImage,
}: StoryMetadataInput): Metadata & { date: string; image: string; alt: string } {
  const socialImage = ogImage ?? image;

  return {
    title,
    description,
    date,
    image,
    alt,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: socialImage,
          alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}
