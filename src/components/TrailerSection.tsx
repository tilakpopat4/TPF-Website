'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import VideoModal from './VideoModal';
import { motion } from 'framer-motion';

export default function TrailerSection({ trailerProjects }: { trailerProjects: any[] }) {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string, title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlay = (project: any) => {
    setSelectedVideo({ 
      url: project.youtubeUrl || project.trailerUrl, 
      title: project.title 
    });
    setIsModalOpen(true);
  };

  if (trailerProjects.length === 0) {
    return (
      <div className={styles.noTrailers}>
        <p>No trailers uploaded yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.trailerScroll}>
        {trailerProjects.map((project: any) => (
          <motion.div 
            key={project.id} 
            className={styles.trailerItem}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className={styles.playerWrapper} 
              style={{ cursor: 'pointer' }}
              onClick={() => handlePlay(project)}
            >
              {/* Thumbnail Overlay */}
              <div 
                className={styles.trailerThumbnail}
                style={project.bannerUrl ? { backgroundImage: `url(${project.bannerUrl})` } : {}}
              >
                <div className={styles.playOverlay}>
                  <div className={styles.playIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.trailerTitle}>
              <h3>{project.title}</h3>
              <p>Watch Trailer</p>
            </div>
          </motion.div>
        ))}
      </div>

      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoUrl={selectedVideo?.url || null}
        title={selectedVideo?.title}
      />
    </>
  );
}
