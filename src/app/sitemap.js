import { getAllPosts } from './lib/posts';

export default async function sitemap() {
  const posts = await getAllPosts();
  const baseUrl = 'https://yourdomain.com';

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  const routes = ['', '/blog'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...postUrls];
}