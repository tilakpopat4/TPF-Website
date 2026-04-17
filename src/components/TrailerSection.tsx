'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrailerSection({ btsItems }: { btsItems: any[] }) {
  const [activeItem, setActiveItem] = useState(btsItems[0] || null);
  // isPlaying = false by default → shows thumbnail with play button
  const [isPlaying, setIsPlaying] = useState(false);

  const getVideoId = (url: string | null): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string | null) => {
    if (!url) return '';
    const videoId = getVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=red`;
    }
    return url;
  };

  // Returns the best available thumbnail for a BTS item
  const getDisplayThumbnail = (item: any): string | null => {
    if (item.thumbnail) return item.thumbnail;
    const videoId = getVideoId(item.videoUrl);
    if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return null;
  };

  const isYouTubeUrl = (url: string | null) => {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };

  // Switch items → reset to thumbnail state
  const handleSelectItem = (item: any) => {
    setActiveItem(item);
    setIsPlaying(false);
  };

  if (btsItems.length === 0) {
    return (
      <div className={styles.noTrailers}>
        <p>No content uploaded yet. Stay tuned!</p>
      </div>
    );
  }

  const thumbnail = getDisplayThumbnail(activeItem);

  return (
    <div className={styles.featuredPlayerContainer}>
      {/* Main Player Display */}
      <div className={styles.mainPlayerWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            className={styles.playerContent}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.playerFrame}>
              {isPlaying ? (
                // --- PLAYING STATE: show iframe/video ---
                activeItem.videoUrl && isYouTubeUrl(activeItem.videoUrl) ? (
                  <iframe
                    key={activeItem.id + '-playing'}
                    src={getEmbedUrl(activeItem.videoUrl)}
                    title={activeItem.title}
                    className={styles.iframe}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : activeItem.videoUrl ? (
                  <video
                    src={activeItem.videoUrl}
                    poster={thumbnail || undefined}
                    controls
                    autoPlay
                    className={styles.iframe}
                    style={{ background: '#000', borderRadius: '24px' }}
                  ></video>
                ) : null
              ) : (
                // --- IDLE STATE: show thumbnail + play button ---
                <div
                  className={styles.btsThumbOverlay}
                  style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : { background: '#111' }}
                  onClick={() => setIsPlaying(true)}
                >
                  {/* Play button circle */}
                  <motion.div
                    className={styles.bigPlayBtn}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </motion.div>
                </div>
              )}
            </div>

            <div className={styles.activeTitle}>
              <h3>{activeItem.title}</h3>
              <p>{isPlaying ? 'NOW WATCHING' : 'CLICK TO PLAY'}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Selection */}
      <div className={styles.thumbnailList}>
        <p className={styles.listLabel}>More Experiences</p>
        <div className={styles.thumbnailGrid}>
          {btsItems.map((item: any) => (
            <motion.div
              key={item.id}
              className={`${styles.miniThumbnail} ${activeItem.id === item.id ? styles.activeMini : ''}`}
              onClick={() => handleSelectItem(item)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={styles.miniImg}
                style={getDisplayThumbnail(item)
                  ? { backgroundImage: `url(${getDisplayThumbnail(item)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { backgroundColor: '#222' }
                }
              >
                {activeItem.id === item.id && isPlaying ? (
                  <div className={styles.playingIndicator}>
                    <div className={styles.wave}></div>
                    <div className={styles.wave}></div>
                    <div className={styles.wave}></div>
                  </div>
                ) : (
                  <div className={styles.miniPlayOverlay}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
              </div>
              <p className={styles.miniTitle}>{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
