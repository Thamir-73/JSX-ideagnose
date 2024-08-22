import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'quotes.md');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);
    const quotesList = content.split('\n\n').slice(2); // Skip the title and description
    return NextResponse.json(quotesList);
  } catch (error) {
    console.error('Error reading quotes file:', error);
    return NextResponse.json({ error: 'Unable to fetch quotes' }, { status: 500 });
  }
}