import styles from "./page.module.css";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Spotify episode ID extracted from the shared URL
const SPOTIFY_EPISODE_ID = "5H3x5h6Vxghl6VA0Dcu3uN";

export default async function MusicPage() {
  const musicTracks = await prisma.music.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className={styles.main}>
      <div className={styles.backgroundBlur}></div>

      <section className="container section">
        <div className={styles.header}>
          <h1 className="text-gradient">TPF Music</h1>
          <p>The Original Soundtracks &amp; Compositions</p>
          <div className="line" style={{ margin: '1rem auto 0' }}></div>
        </div>

        {/* Spotify Player — Full Width Featured */}
        <div className={styles.spotifyWrapper}>
          <div className={styles.spotifyLabel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            NOW STREAMING ON SPOTIFY
          </div>
          <iframe
            src={`https://open.spotify.com/embed/episode/${SPOTIFY_EPISODE_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={styles.spotifyFrame}
            title="TPF Spotify Episode"
          ></iframe>
        </div>

        {/* Additional Tracks from DB */}
        {musicTracks.length > 0 && (
          <div className={styles.tracksSection}>
            <h3 className={styles.sectionSubtitle}>More Tracks</h3>
            <div className={styles.posterGrid}>
              {musicTracks.map((track) => (
                <div key={track.id} className={`${styles.posterCard} glass`}>
                  <div className={styles.posterImageOuter}>
                    <img
                      src={track.posterUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400"}
                      alt={track.title}
                      className={styles.posterImage}
                    />
                  </div>
                  <div className={styles.posterInfo}>
                    <h4>{track.title}</h4>
                    <audio controls className={styles.miniAudio}>
                      <source src={track.audioUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
