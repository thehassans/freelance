export interface MdxMetadata {
  // Blog
  title?: string;
  date?: string;
  readTime?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  featured?: boolean;
  
  // Glossary
  term?: string;
  definition?: string;
  
  // Template
  name?: string;
  type?: string;
  format?: string;
  description?: string;
  isPro?: boolean;
}

export interface MdxContent {
  metadata: MdxMetadata;
  content: string;
}

export async function getPostBySlug(slug: string, folder: 'blog' | 'glossary' | 'templates'): Promise<MdxContent | null> {
  try {
    const response = await fetch(`/api/content/${folder}/${slug}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(`Error fetching post ${folder}/${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(folder: 'blog' | 'glossary' | 'templates'): Promise<(MdxMetadata & { slug: string })[]> {
  try {
    const response = await fetch(`/api/content/${folder}`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error(`Error fetching all posts in ${folder}:`, error);
    return [];
  }
}
