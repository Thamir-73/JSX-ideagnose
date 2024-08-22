import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/app/posts');

async function getAllCategories() {
  const fileNames = await fs.readdir(postsDirectory);
  const allCategories = await Promise.all(fileNames.map(async (fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return data.category;
  }));

  const uniqueCategories = [...new Set(allCategories.filter(Boolean))];
  return uniqueCategories;
}

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}