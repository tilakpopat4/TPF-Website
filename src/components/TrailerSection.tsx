'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrailerSection({ trailerProjects }: { trailerProjects: any[] }) {
  const [activeProject, setActiveProject] = useState(trailerProjects[0] || null);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=red`;
    }
    return url;
  };

  const isYouTubeUrl = (url: string) => {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };

  if (trailerProjects.length === 0) {
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
            key={activeProject.id}
            className={styles.playerContent}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.playerFrame}>
              {isYouTubeUrl(activeProject.youtubeUrl || activeProject.trailerUrl) ? (
                <iframe
                  src={getEmbedUrl(activeProject.youtubeUrl || activeProject.trailerUrl)}
                  title={activeProject.title}
                  className={styles.iframe}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  src={activeProject.trailerUrl} 
                  poster={activeProject.bannerUrl}
                  controls 
                  className={styles.iframe}
                  style={{ background: '#000', borderRadius: '24px' }}
                ></video>
              )}
            </div>
            <div className={styles.activeTitle}>
              <h3>{activeProject.title}</h3>
              <p>NOW WATCHING</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Selection */}
      <div className={styles.thumbnailList}>
        <p className={styles.listLabel}>More Experiences</p>
        <div className={styles.thumbnailGrid}>
          {trailerProjects.map((project: any) => (
            <motion.div 
              key={project.id}
              className={`${styles.miniThumbnail} ${activeProject.id === project.id ? styles.activeMini : ''}`}
              onClick={() => setActiveProject(project)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className={styles.miniImg} 
                style={project.bannerUrl ? { backgroundImage: `url(${project.bannerUrl})` } : { backgroundColor: '#222' }}
              >
                {activeProject.id === project.id && (
                  <div className={styles.playingIndicator}>
                    <div className={styles.wave}></div>
                    <div className={styles.wave}></div>
                    <div className={styles.wave}></div>
                  </div>
                )}
              </div>
              <p className={styles.miniTitle}>{project.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
