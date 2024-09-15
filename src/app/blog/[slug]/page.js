import React, { Suspense } from 'react';
import BlogPostContent from './BlogPostContent';
import BlogPostSkeleton from '../../components/BlogPostSkeleton';
import dynamic from 'next/dynamic';
import { getPostBySlug } from '../../lib/posts';
import Script from 'next/script';

const Comments = dynamic(() => import('../../components/Comments'), {
  ssr: false
});

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [post.image || '/default-og-image.jpg'],
    },
  };
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author || "Anonymous"
    },
    "image": post.image || "/default-og-image.jpg",
    "url": `https://ideagnose.com/blog/${params.slug}`,
    "description": post.excerpt || post.content.substring(0, 160)
  };

  return (
    <main className="min-h-screen flex-col items-center justify-between p-2 pb-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="relative w-full sm:max-w-[95%] md:max-w-full lg:max-w-5xl mx-auto mt-[4.6rem] min-h-[calc(100vh-6rem)]">
        <div className="absolute inset-0 md:inset-x-4 lg:inset-x-8 top-2 bottom-4 bg-gray border border-gray-300 dark:bg-[#2C3E57] dark:border-gray-700 rounded-lg shadow-lg"></div>
        <div className="relative py-7 px-4 md:px-8 lg:px-12 min-h-[calc(100vh-6rem)]">
          <Suspense fallback={<BlogPostSkeleton />}>
            <BlogPostContent slug={params.slug} />
          </Suspense>
        </div>
      </section>

      {/* Comments section outside the main content div */}
      <section className="w-full sm:max-w-[95%] md:max-w-full lg:max-w-5xl lg:p-5 mx-auto">
        <Comments postSlug={params.slug} />
      </section>
    </main>
  );
}