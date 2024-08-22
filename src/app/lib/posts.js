import path from 'path';
import matter from 'gray-matter';
import { promises as fs } from 'fs';

const postsDirectory = path.join(process.cwd(), 'src/app/posts');

export async function getPostBySlug(slug) {
  try {
    console.log('Fetching post with slug:', slug);
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    console.log('Full path:', fullPath);

    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      ...data,
      content,
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    console.error('Error in getPostBySlug:', error);
    return null;
  }
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/g).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function getAllPosts() {
  const fileNames = await fs.readdir(postsDirectory);
  const posts = await Promise.all(fileNames.map(async (fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    return await getPostBySlug(slug);
  }));
  return posts;
}

export async function getAllCategories() {
  const posts = await getAllPosts();
  const categories = new Set(posts.map(post => post.category).filter(Boolean));
  return Array.from(categories);
}

export async function getPostsByCategory(category) {
  const posts = await getAllPosts();
  return posts.filter(post => post.category && post.category.toLowerCase() === category.toLowerCase());
}