'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!videoUrl) return null;

  // Extract video ID and format embed URL
  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{title || 'Video Player'}</h3>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.videoWrapper}>
              <iframe
                src={embedUrl}
                title={title || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={styles.iframe}
              ></iframe>
            </div>

            <div className={styles.footer}>
              <div className={styles.brand}>
                <span className={styles.dot}></span>
                TPF PREMIUM EXPERIENCE
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
