export type ProjectCategory =
  | "All"
  | "Projects & Case Studies"
  | "Partner Work"
  | "Model Launches"
  | "Essays & Policy";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "All",
  "Projects & Case Studies",
  "Partner Work",
  "Model Launches",
  "Essays & Policy",
];

export interface Post {
  slug: string;
  title: string;
  date: string;
  datePublished: string;
  category: Exclude<ProjectCategory, "All">;
  description: string;
  excerpt: string;
  author: string;
  coverImage?: string;
  coverImageAlt?: string;
  ogImage?: string;
  tags: string[];
  models: string[];
  linkedinHook?: string;
  linkedinBullets?: string[];
  linkedinPost?: string;
  draft?: boolean;
  content: string;
}
