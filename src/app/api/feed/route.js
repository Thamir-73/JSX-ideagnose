import RSS from 'rss';
import { getAllPosts } from '../../lib/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getAllPosts();
  const site_url = 'https://yourdomain.com';

  const feed = new RSS({
    title: 'Your Blog Name',
    description: 'Your blog description',
    site_url: site_url,
    feed_url: `${site_url}/api/feed`,
  });

  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      url: `${site_url}/blog/${post.slug}`,
      date: post.date,
      author: post.author || 'Anonymous',
    });
  });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}