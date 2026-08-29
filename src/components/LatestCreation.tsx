'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './LatestCreation.module.css';

interface Props {
  youtubeUrl: string;
  title: string;
}

export default function LatestCreation({ youtubeUrl, title }: Props) {
  const [playing, setPlaying] = useState(false);

  const getVideoId = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([^#&?]{11})/);
    return m ? m[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=red`;
  const thumbFallbacks = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  ];
  const [thumbIdx, setThumbIdx] = useState(0);

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.eyebrow}>▶ Now Showing</p>
          <h2 className={styles.heading}>Latest <span className={styles.accent}>Creation</span></h2>
          <div className={styles.rule} />
          {title && <p className={styles.subTitle}>{title}</p>}
        </motion.div>

        {/* Player */}
        <motion.div
          className={styles.playerWrapper}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className={styles.playerFrame}>
            {playing ? (
              <iframe
                src={embedUrl}
                title={title}
                className={styles.iframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className={styles.thumbOverlay} onClick={() => setPlaying(true)}>
                {/* Thumbnail with fallback */}
                <Image
                  key={thumbFallbacks[thumbIdx]}
                  src={thumbFallbacks[thumbIdx]}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className={styles.thumbImg}
                  quality={85}
                  priority
                  onError={() => {
                    if (thumbIdx < thumbFallbacks.length - 1) setThumbIdx(thumbIdx + 1);
                  }}
                />
                {/* Dark scrim */}
                <div className={styles.scrim} />
                {/* Play button */}
                <motion.div
                  className={styles.playBtn}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
                {/* Bottom label */}
                <div className={styles.thumbLabel}>
                  <span className={styles.thumbTitle}>{title}</span>
                  <span className={styles.thumbCta}>Click to Watch</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
