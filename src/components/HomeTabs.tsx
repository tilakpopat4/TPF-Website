'use client';

import { useState } from 'react';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VideoModal from './VideoModal';

export default function HomeTabs({ initialProjects, announcements }: any) {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string, title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: any) => {
    const videoUrl = project.youtubeUrl || project.trailerUrl;
    if (videoUrl) {
      setSelectedVideo({ url: videoUrl, title: project.title });
      setIsModalOpen(true);
    }
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
            className={styles.projectsGrid}
          >
            {initialProjects.map((project: any, idx: number) => (
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
                  {!project.bannerUrl && <span className={styles.projectNumber}>0{idx + 1}</span>}
                  
                  {(project.youtubeUrl || project.trailerUrl) && (
                    <div className={styles.playOverlay}>
                      <div className={styles.playIconBox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
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
            ))}
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
