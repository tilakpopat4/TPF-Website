export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
  duration?: string;
  publishedTime?: string;
  url: string;
}

export interface YouTubeChannelData {
  channelId: string;
  title: string;
  handle: string;
  url: string;
  avatar: string;
  subscribers: string;
  videoCount: string;
  description: string;
  videos: YouTubeVideoItem[];
}

const DEFAULT_CHANNEL: YouTubeChannelData = {
  channelId: 'UCkk7H3tMgtveR-8a7vfFrvQ',
  title: 'Tilak Popat Films',
  handle: '@tilakpopatfilms',
  url: 'https://www.youtube.com/@tilakpopatfilms',
  avatar: 'https://yt3.googleusercontent.com/LbSHgHFyq4cNLoWRsXo3jZAeoTL3sC2wh-o7BNU-LC-aj6gUvMrdvmek2lbgjTINE34qn_0bjkQ=s900-c-k-c0x00ffffff-no-rj',
  subscribers: '400 subscribers',
  videoCount: '19 videos',
  description: 'Independent filmmaking, psychological short series, original storytelling, and cinematic experiments helmed by filmmaker Tilak Popat.',
  videos: [
    {
      videoId: 'cPEzprKl8bs',
      title: 'Announcement Title Card | PARIKSHA | Chapter 2 | अब तो चाय भी महेंगी लगती है | Tilak Popat Films',
      thumbnail: 'https://i.ytimg.com/vi/cPEzprKl8bs/hqdefault.jpg',
      duration: '0:44',
      url: 'https://www.youtube.com/watch?v=cPEzprKl8bs'
    },
    {
      videoId: 'B3x4bpVqjUU',
      title: 'Behind The Scenes | PARIKSHA | Chapter - 1 | Tilak Popat Films',
      thumbnail: 'https://i.ytimg.com/vi/B3x4bpVqjUU/hqdefault.jpg',
      duration: '2:28',
      url: 'https://www.youtube.com/watch?v=B3x4bpVqjUU'
    },
    {
      videoId: 'Nzaqn4p97v8',
      title: "Shubham Sir's Monologue Clip | PARIKSHA Chapter - 1 | Tilak Popat Films",
      thumbnail: 'https://i.ytimg.com/vi/Nzaqn4p97v8/hqdefault.jpg',
      duration: '0:55',
      url: 'https://www.youtube.com/watch?v=Nzaqn4p97v8'
    },
    {
      videoId: 'lZEWooF6ifI',
      title: 'PARIKSHA | Chapter 1 - Schoollife Ki Suicide | Tilak Popat Films',
      thumbnail: 'https://i.ytimg.com/vi/lZEWooF6ifI/hqdefault.jpg',
      duration: '17:43',
      url: 'https://www.youtube.com/watch?v=lZEWooF6ifI'
    }
  ]
};

export async function fetchYouTubeChannel(
  apiKey?: string, 
  customHandle?: string,
  overrideSubs?: string,
  overrideVideos?: string
): Promise<YouTubeChannelData> {
  const handle = customHandle || 'tilakpopatfilms';
  const cleanHandle = handle.replace(/^@/, '');

  // 1. If API Key provided, try YouTube Data API v3
  if (apiKey) {
    try {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${cleanHandle}&key=${apiKey}`,
        { next: { revalidate: 1800 } }
      );
      if (channelRes.ok) {
        const channelJson = await channelRes.json();
        const item = channelJson.items?.[0];
        if (item) {
          const channelId = item.id;
          const title = item.snippet?.title || DEFAULT_CHANNEL.title;
          const avatar = item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || DEFAULT_CHANNEL.avatar;
          const rawSubCount = item.statistics?.subscriberCount;
          const subscribers = overrideSubs || (rawSubCount ? `${Number(rawSubCount).toLocaleString()} subscribers` : DEFAULT_CHANNEL.subscribers);
          const rawVidCount = item.statistics?.videoCount;
          const videoCount = overrideVideos || (rawVidCount ? `${Number(rawVidCount).toLocaleString()} videos` : DEFAULT_CHANNEL.videoCount);
          const description = item.snippet?.description || DEFAULT_CHANNEL.description;

          // Fetch recent uploads
          let videos: YouTubeVideoItem[] = [];
          try {
            const searchRes = await fetch(
              `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=6&key=${apiKey}`,
              { next: { revalidate: 1800 } }
            );
            if (searchRes.ok) {
              const searchJson = await searchRes.json();
              videos = (searchJson.items || []).map((v: any) => ({
                videoId: v.id?.videoId,
                title: v.snippet?.title,
                thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url,
                url: `https://www.youtube.com/watch?v=${v.id?.videoId}`
              })).filter((v: YouTubeVideoItem) => !!v.videoId);
            }
          } catch (e) {
            console.error('Error fetching YouTube API videos:', e);
          }

          return {
            channelId,
            title,
            handle: `@${cleanHandle}`,
            url: `https://www.youtube.com/@${cleanHandle}`,
            avatar,
            subscribers,
            videoCount,
            description,
            videos: videos.length > 0 ? videos : DEFAULT_CHANNEL.videos
          };
        }
      }
    } catch (e) {
      console.error('Error querying YouTube Data API:', e);
    }
  }

  // 2. Live fetch directly from YouTube channel header
  try {
    const res = await fetch(`https://www.youtube.com/@${cleanHandle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 1800 }
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);
      
      let title = DEFAULT_CHANNEL.title;
      let channelId = DEFAULT_CHANNEL.channelId;
      let avatar = DEFAULT_CHANNEL.avatar;
      let subscribers = overrideSubs || '';
      let videoCount = overrideVideos || '';
      let description = DEFAULT_CHANNEL.description;
      let videos: YouTubeVideoItem[] = [];

      if (match?.[1]) {
        try {
          const data = JSON.parse(match[1]);
          
          // Accurate extraction from channel page header
          const pageHeader = data.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
          const headerRows = pageHeader?.metadata?.contentMetadataViewModel?.metadataRows || [];

          if (pageHeader?.title?.dynamicTextViewModel?.text?.content) {
            title = pageHeader.title.dynamicTextViewModel.text.content;
          }

          const headerAvatar = pageHeader?.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image?.sources?.slice(-1)[0]?.url;
          if (headerAvatar) avatar = headerAvatar;

          if (!subscribers || !videoCount) {
            for (const row of headerRows) {
              for (const part of row.metadataParts || []) {
                const text = part.text?.content || '';
                if (!subscribers && /subscribers?/i.test(text)) {
                  subscribers = text;
                } else if (!videoCount && /videos?/i.test(text)) {
                  videoCount = text;
                }
              }
            }
          }

          // Legacy header fallback
          if (!subscribers) {
            const legacyHeader = data.header?.c4TabbedHeaderRenderer;
            subscribers = legacyHeader?.subscriberCountText?.simpleText || '';
            if (!videoCount) {
              videoCount = legacyHeader?.videosCountText?.runs?.[0]?.text || '';
            }
          }

          // Also extract videos from channel tab
          const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
          const videoTab = tabs.find((t: any) => t.tabRenderer?.title === 'Videos' || t.tabRenderer?.selected);
          const items = videoTab?.tabRenderer?.content?.richGridRenderer?.contents || [];

          for (const item of items) {
            const lockup = item.richItemRenderer?.content?.lockupViewModel;
            if (lockup) {
              const vTitle = lockup.metadata?.lockupMetadataViewModel?.title?.content;
              const thumb = lockup.contentImage?.thumbnailViewModel?.image?.sources?.slice(-1)[0]?.url;
              const duration = lockup.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text;
              
              let videoId = lockup.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId;
              if (!videoId && thumb) {
                const idMatch = thumb.match(/\/vi\/([^\/]+)\//);
                if (idMatch) videoId = idMatch[1];
              }

              if (videoId && vTitle) {
                videos.push({
                  videoId,
                  title: vTitle,
                  thumbnail: thumb || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                  duration,
                  url: `https://www.youtube.com/watch?v=${videoId}`
                });
              }
            }
          }
        } catch (parseErr) {
          console.error('Error parsing ytInitialData JSON:', parseErr);
        }
      }

      return {
        channelId,
        title,
        handle: `@${cleanHandle}`,
        url: `https://www.youtube.com/@${cleanHandle}`,
        avatar: avatar || DEFAULT_CHANNEL.avatar,
        subscribers: subscribers || DEFAULT_CHANNEL.subscribers,
        videoCount: videoCount || DEFAULT_CHANNEL.videoCount,
        description,
        videos: videos.length > 0 ? videos.slice(0, 6) : DEFAULT_CHANNEL.videos
      };
    }
  } catch (err) {
    console.error('Error scraping YouTube channel live stats:', err);
  }

  return {
    ...DEFAULT_CHANNEL,
    subscribers: overrideSubs || DEFAULT_CHANNEL.subscribers,
    videoCount: overrideVideos || DEFAULT_CHANNEL.videoCount
  };
}
