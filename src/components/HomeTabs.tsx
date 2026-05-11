'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';

const PROJECTS_PER_SLIDE = 2;

export default function HomeTabs({ initialProjects, announcements }: any) {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string, title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handleProjectClick = (project: any) => {
    const videoUrl = project.youtubeUrl || project.trailerUrl;
    if (videoUrl) {
      setSelectedVideo({ url: videoUrl, title: project.title });
      setIsModalOpen(true);
    }
  };

  // Split projects into slides of 2
  const slides: any[][] = [];
  for (let i = 0; i < initialProjects.length; i += PROJECTS_PER_SLIDE) {
    slides.push(initialProjects.slice(i, i + PROJECTS_PER_SLIDE));
  }
  const totalSlides = slides.length;

  const goNext = () => {
    if (slideIndex < totalSlides - 1) {
      setDirection(1);
      setSlideIndex(slideIndex + 1);
    }
  };

  const goPrev = () => {
    if (slideIndex > 0) {
      setDirection(-1);
      setSlideIndex(slideIndex - 1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <div className={styles.tabsContainer}>
      {/* Tab Switcher */}
      <div className={styles.tabSwitcher}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Featured Projects
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'announcements' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Latest Announcements
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'projects' ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={styles.projectsCarouselWrapper}
          >
            {/* Carousel viewport */}
            <div className={styles.projectsCarousel}>
              {/* Prev button */}
              <button
                className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                onClick={goPrev}
                disabled={slideIndex === 0}
                aria-label="Previous projects"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Slide area */}
              <div className={styles.carouselSlideArea}>
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={slideIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className={styles.projectsGrid}
                  >
                    {slides[slideIndex]?.map((project: any, idx: number) => {
                      const globalIdx = slideIndex * PROJECTS_PER_SLIDE + idx;
                      return (
                        <div
                          key={project.id}
                          className={`${styles.projectCard} glass`}
                          onClick={() => handleProjectClick(project)}
                          style={{ cursor: project.youtubeUrl || project.trailerUrl ? 'pointer' : 'default' }}
                        >
                          <div
                            className={styles.projectImagePlaceholder}
                            style={project.bannerUrl ? { backgroundImage: `url(${project.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'transparent' } : {}}
                          >
                            {!project.bannerUrl && <span className={styles.projectNumber}>0{globalIdx + 1}</span>}
                            {(project.youtubeUrl || project.trailerUrl) && (
                              <div className={styles.playOverlay}>
                                <div className={styles.playIconBox}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={styles.projectInfo}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next button */}
              <button
                className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                onClick={goNext}
                disabled={slideIndex === totalSlides - 1}
                aria-label="Next projects"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Dot indicators */}
            {totalSlides > 1 && (
              <div className={styles.carouselDots}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.carouselDot} ${i === slideIndex ? styles.carouselDotActive : ''}`}
                    onClick={() => { setDirection(i > slideIndex ? 1 : -1); setSlideIndex(i); }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="announcements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className={styles.announcementsHomeList}
          >
            {announcements.length === 0 ? (
                <div className={styles.emptyAnn}>
                    <p>No announcements yet. Stay tuned!</p>
                </div>
            ) : (
                <div className={styles.homeAnnGrid}>
                    {announcements.map((ann: any) => (
                        <div key={ann.id} className={`${styles.homeAnnCard} glass`}>
                            {ann.imageUrl && <img src={ann.imageUrl} alt={ann.title} className={styles.homeAnnImg} />}
                            <div className={styles.homeAnnContent}>
                                <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                                <h4>{ann.title}</h4>
                                <p>{ann.content.substring(0, 100)}...</p>
                            </div>
                        </div>
                    ))}
                    <Link href="/announcements" className={styles.viewAllBtn}>
                        View All Announcements →
                    </Link>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoUrl={selectedVideo?.url || null}
        title={selectedVideo?.title}
      />
    </div>
  );
}
