'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './YouTubeChannel.module.css';
import VideoModal from './VideoModal';
import { YouTubeChannelData, YouTubeVideoItem } from '@/lib/youtube';

interface Props {
  channelData: YouTubeChannelData;
}

export default function YouTubeChannel({ channelData }: Props) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video: YouTubeVideoItem) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const subscribeUrl = `${channelData.url}?sub_confirmation=1`;

  return (
    <section className={styles.section} id="youtube-channel">
      <div className={`container ${styles.inner}`}>
        
        {/* Section Header */}
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.eyebrow}>
            <svg className={styles.eyebrowIcon} viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Official YouTube Channel
          </p>
          <h2 className={styles.heading}>Watch on <span className={styles.accent}>YouTube</span></h2>
          <div className={styles.rule} />
        </motion.div>

        {/* Channel Tab Card */}
        <motion.div 
          className={styles.channelCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className={styles.cardGlow} />

          <div className={styles.channelInfoLeft}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarRing} />
              <img 
                src={channelData.avatar} 
                alt={channelData.title}
                className={styles.avatarImg}
                loading="eager"
              />
            </div>

            <div className={styles.channelMeta}>
              <div className={styles.channelTitleRow}>
                <h3 className={styles.channelTitle}>{channelData.title}</h3>
                <span className={styles.verifiedBadge} title="Verified Channel">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </span>
              </div>
              <p className={styles.channelHandle}>{channelData.handle}</p>
              
              <div className={styles.statsRow}>
                <span className={styles.statBadge}>
                  <span className={styles.statDot} />
                  {channelData.subscribers}
                </span>
                <span className={styles.statBadge}>
                  <span className={styles.statDot} />
                  {channelData.videoCount}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.channelActionsRight}>
            <a 
              href={subscribeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.subscribeBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe
            </a>

            <a 
              href={channelData.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.visitBtn}
            >
              Visit Channel
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Recent Channel Uploads */}
        {channelData.videos && channelData.videos.length > 0 && (
          <div>
            <div className={styles.videosHeader}>
              <h4 className={styles.videosTitle}>Latest Uploads</h4>
              <a 
                href={`${channelData.url}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewAllLink}
              >
                View all on YouTube
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            </div>

            <div className={styles.videosGrid}>
              {channelData.videos.map((video, idx) => (
                <motion.div
                  key={video.videoId || idx}
                  className={styles.videoCard}
                  onClick={() => handleVideoClick(video)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <div className={styles.thumbContainer}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className={styles.thumbImg}
                      loading="lazy"
                    />
                    <div className={styles.playBadge}>
                      <div className={styles.playIconCircle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {video.duration && (
                      <span className={styles.durationBadge}>{video.duration}</span>
                    )}
                  </div>

                  <div className={styles.videoMeta}>
                    <h5 className={styles.videoTitle} title={video.title}>{video.title}</h5>
                    <span className={styles.videoSub}>Watch Video</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Interactive Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={selectedVideo?.url || (selectedVideo ? `https://www.youtube.com/watch?v=${selectedVideo.videoId}` : null)}
        title={selectedVideo?.title}
      />
    </section>
  );
}
