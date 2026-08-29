'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from '@/app/page.module.css';
import VideoModal from './VideoModal';

interface ProjectsGridProps {
  projects: any[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
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
    <div className={styles.projectsHorizontalGrid}>
      {projects.map((project) => {
        const hasVideo = !!(project.youtubeUrl || project.trailerUrl);
        return (
          <div
            key={project.id}
            className={styles.projectCardHorizontal}
            onClick={() => handleProjectClick(project)}
            style={{ cursor: hasVideo ? 'pointer' : 'default' }}
          >
            <div className={styles.projectCardHorizontalFrame}>
              {project.bannerUrl && (
                <Image 
                  src={project.bannerUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                  quality={85}
                  loading="lazy"
                />
              )}
              {hasVideo && (
                <div className={styles.playOverlay}>
                  <div className={styles.playIconBox}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <h3 className={styles.projectCardHorizontalTitle}>{project.title}</h3>
          </div>
        );
      })}

      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoUrl={selectedVideo?.url || null}
        title={selectedVideo?.title}
      />
    </div>
  );
}
