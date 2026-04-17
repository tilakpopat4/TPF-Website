'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrailerSection({ btsItems }: { btsItems: any[] }) {
  const [activeItem, setActiveItem] = useState(btsItems[0] || null);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=red`;
    }
    return url;
  };

  const isYouTubeUrl = (url: string | null) => {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };

  if (btsItems.length === 0) {
    return (
      <div className={styles.noTrailers}>
        <p>No content uploaded yet. Stay tuned!</p>
      </div>
    );
  }

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
              {activeItem.videoUrl && isYouTubeUrl(activeItem.videoUrl) ? (
                <iframe
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
                  poster={activeItem.thumbnail || undefined}
                  controls 
                  className={styles.iframe}
                  style={{ background: '#000', borderRadius: '24px' }}
                ></video>
              ) : (
                <div className={styles.iframe} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', borderRadius: '24px' }}>
                    {activeItem.thumbnail && <img src={activeItem.thumbnail} alt={activeItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />}
                    <p style={{ position: 'absolute', color: '#fff', fontSize: '1.2rem' }}>Exclusive Image Content</p>
                </div>
              )}
            </div>
            <div className={styles.activeTitle}>
              <h3>{activeItem.title}</h3>
              <p>NOW WATCHING</p>
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
              onClick={() => setActiveItem(item)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className={styles.miniImg} 
                style={item.thumbnail ? { backgroundImage: `url(${item.thumbnail})` } : { backgroundColor: '#222' }}
              >
                {activeItem.id === item.id && (
                  <div className={styles.playingIndicator}>
                    <div className={styles.wave}></div>
                    <div className={styles.wave}></div>
                    <div className={styles.wave}></div>
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
