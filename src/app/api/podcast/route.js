// src/app/api/podcast/route.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });

    const response = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: process.env.YOUTUBE_PLAYLIST_ID,
      maxResults: 50,  // Fetch more items to ensure we get the latest
      order: 'date'    // This sorts by date, but in ascending order
    });

    // Sort the items by date in descending order and take the first two
    const latestEpisodes = response.data.items
      .sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt))
      .slice(0, 2)
      .map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        videoId: item.snippet.resourceId.videoId,
        publishedAt: item.snippet.publishedAt
      }));

    return NextResponse.json(latestEpisodes);
  } catch (error) {
    console.error('Error fetching latest podcasts:', error);
    return NextResponse.json({ error: 'Error fetching latest podcasts' }, { status: 500 });
  }
}