import { NextResponse } from 'next/server';
import { fetchYouTubeChannel } from '@/lib/youtube';
import prisma from '@/lib/prisma';

export const revalidate = 3600;

export async function GET() {
  try {
    let apiKey = process.env.YOUTUBE_API_KEY;
    let handle = 'tilakpopatfilms';

    try {
      const apiKeySetting = await prisma.settings.findUnique({ where: { key: 'youtubeApiKey' } });
      const handleSetting = await prisma.settings.findUnique({ where: { key: 'youtubeHandle' } });
      if (apiKeySetting?.value) apiKey = apiKeySetting.value;
      if (handleSetting?.value) handle = handleSetting.value;
    } catch {
      // ignore db error
    }

    const channelData = await fetchYouTubeChannel(apiKey, handle);
    return NextResponse.json(channelData);
  } catch (error) {
    console.error('API Error in /api/youtube-channel:', error);
    return NextResponse.json({ error: 'Failed to load YouTube channel' }, { status: 500 });
  }
}
