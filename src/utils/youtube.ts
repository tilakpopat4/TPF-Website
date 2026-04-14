export function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;

  // Regular expression to match various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  }

  return null;
}

export function isYouTubeUrl(url: string | null): boolean {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}
