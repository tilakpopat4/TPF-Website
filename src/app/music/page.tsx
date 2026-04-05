import Image from "next/image";
import styles from "./page.module.css";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function MusicPage() {
  const musicCount = await prisma.music.count();
  const musicTracks = musicCount === 0
    ? [
        { id: '1', title: 'Cosmic Echoes', audioUrl: '#', posterUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400' },
        { id: '2', title: 'Neon Pulse', audioUrl: '#', posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400' },
        { id: '3', title: 'Whispers of Time', audioUrl: '#', posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' }
      ]
    : await prisma.music.findMany({ orderBy: { createdAt: 'desc' } });

  const activeTrack = musicTracks[0];

  return (
    <div className={styles.main}>
      <div className={styles.backgroundBlur}></div>
      
      <section className="container section">
        <div className={styles.header}>
          <h1 className="text-gradient">TPF Music</h1>
          <p>The Original Soundtracks & Compositions</p>
          <div className="line" style={{ margin: '1rem auto 0' }}></div>
        </div>

        <div className={styles.contentWrapper}>
          {/* Audio Player Section */}
          <div className={`${styles.playerPanel} glass animate-fade-in`}>
            <div className={styles.vinylContainer}>
              <div className={styles.vinyl}>
                <div className={styles.vinylCenter}>
                  <div className={styles.vinylHole}></div>
                </div>
              </div>
              <div className={styles.stylus}></div>
            </div>
            
            <div className={styles.trackInfo}>
              <h2 className={styles.nowPlaying}>Now Playing</h2>
              <h3 className={styles.trackTitle}>{activeTrack?.title || "No Track Selected"}</h3>
              <p className={styles.artist}>Tilak Popat Films</p>
            </div>

            <div className={styles.controls}>
               <audio controls className={styles.audioElement}>
                 <source src={activeTrack?.audioUrl} type="audio/mpeg" />
                 Your browser does not support the audio element.
               </audio>
            </div>
          </div>

          {/* Posters / Playlist Section */}
          <div className={styles.playlistPanel}>
            <h3 className={styles.panelTitle}>Discover More</h3>
            <div className={styles.posterGrid}>
              {musicTracks.map((track) => (
                <div key={track.id} className={`${styles.posterCard} glass`}>
                  <div className={styles.posterImageOuter}>
                     {/* Using standard img for placeholder urls to avoid next/image domain config errors */}
                     <img 
                       src={track.posterUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400"} 
                       alt={track.title} 
                       className={styles.posterImage} 
                     />
                  </div>
                  <div className={styles.posterInfo}>
                    <h4>{track.title}</h4>
                    <button className={styles.playBtn}>▶ Play</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
