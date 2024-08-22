import React from 'react';
import { notFound } from 'next/navigation';
import { FaPen, FaCalendar, FaClock } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../../lib/posts';
import rehypeRaw from 'rehype-raw';
import BlogPostClient from './BlogPostClient';
import dynamic from 'next/dynamic';

const SubstackEmbed = dynamic(() => import('../../components/SubstackEmbed'), {
  ssr: false
});

export default async function BlogPostContent({ slug }) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-6xl text-gray-800 dark:text-gray-300 min-h-[calc(100vh-10rem)]">
        <div className="text-center mb-2 ">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-700 dark:text-slate-300 prose prose-lg max-w-none prose-slate dark:prose-invert mx-auto max-w-4xl px-4 pt-1 pb-4 border-b-2 border-slate-200 dark:border-slate-600">
            {post.title}
          </h2>
          <div className="flex items-center justify-center text-gray-600 dark:text-slate-400 border-b-2 border-slate-200 dark:border-slate-600 py-2">
            <FaPen className="mr-2" />
            <span className="mr-4">{post.author || 'Thamir'}</span>
            <FaCalendar className="mr-2" />
            <span className="mr-4">{post.date}</span>
            <FaClock className="mr-2" />
            <span>{post.readingTime} mins</span>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray dark:bg-[#2C3E57] py-4 px-0 rounded-lg mb-8">
            <div className="prose prose-lg max-w-none prose-gray dark:text-slate-300 dark:prose-invert"
            style={{ fontWeight: 420 }}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h1 id={props.children.toLowerCase().replace(/\s/g, '-')} {...props} />,
                  h2: ({node, ...props}) => <h2 id={props.children.toLowerCase().replace(/\s/g, '-')} className="text-slate-700 dark:text-slate-200" {...props} />,
                  h3: ({node, ...props}) => <h3 id={props.children.toLowerCase().replace(/\s/g, '-')} className="text-slate-700 dark:text-slate-200" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Substack embed */}
          <div className="mt-8 flex justify-center">
            <SubstackEmbed />
          </div>
        </div>
      </div>
      <BlogPostClient post={post} />
    </>
  );
}