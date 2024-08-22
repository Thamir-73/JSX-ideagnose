import Link from 'next/link';

export default function PostList({ posts }) {
  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.slug} className="border-b pb-4">
          <Link href={`/blog/${post.slug}`} className="text-xl font-semibold hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-600 mt-2">{post.excerpt}</p>
        </li>
      ))}
    </ul>
  );
}