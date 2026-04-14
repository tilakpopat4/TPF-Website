export async function fetchYouTubeMetadata(url: string) {
  try {
    // We can use a simple fetch to get the page content and parse meta tags
    // Or use the YouTube oEmbed API for at least the title
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    const data = await response.json();

    // For the full description, we'd ideally need the Data API, 
    // but we can try to get the 'og:description' if we fetch the HTML
    // However, server-side fetch of YT HTML is often blocked or requires a specialized scraper.
    // For now, let's return what oEmbed gives us (title, author).
    
    return {
      title: data.title || "",
      description: "", // oEmbed doesn't provide description
      author: data.author_name || ""
    };
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    return null;
  }
}
