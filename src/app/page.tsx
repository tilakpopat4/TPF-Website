import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import HomeTabs from "@/components/HomeTabs";
import { getYouTubeEmbedUrl, isYouTubeUrl } from "@/utils/youtube";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projectsCount = await prisma.project.count();
  const projects = projectsCount === 0 
    ? [
        { id: '1', title: 'The Echoes of Silence', description: 'A gripping thriller by TPF.', trailerUrl: '', bannerUrl: '' },
        { id: '2', title: 'Neon Nights', description: 'Cyberpunk short film.', trailerUrl: '', bannerUrl: '' }
      ]
    : await prisma.project.findMany({ take: 10, orderBy: { createdAt: 'desc' } });

  const announcements = await prisma.announcement.findMany({ take: 3, orderBy: { createdAt: 'desc' } });

  // Filter projects that have a trailerUrl
  const trailerProjects = projects.filter((p: any) => p.trailerUrl);

  // Main Trailer to display
  const mainTrailer = projects[0]?.trailerUrl || "";

  return (
    <div className={styles.main}>
      {/* Dynamic Animated Hero Section */}
      <Hero />

      {/* Tabbed Content Section (Projects & Announcements) */}
      <section id="projects" className="section container">
        <HomeTabs initialProjects={projects} announcements={announcements} />
      </section>

      {/* Video Player Section */}
      <section className={styles.trailerSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Watch our <span className="text-gradient">Trailers</span></h2>
            <div className={styles.line}></div>
          </div>
          
          <div className={styles.scrollWrapper}>
            {trailerProjects.length > 0 ? (
              <div className={styles.trailerScroll}>
                {trailerProjects.map((project: any) => (
                  <div key={project.id} className={styles.trailerItem}>
                    <div className={styles.playerWrapper}>
                      {isYouTubeUrl(project.youtubeUrl || project.trailerUrl) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(project.youtubeUrl || project.trailerUrl)!}
                          className={styles.iframe}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-view"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={project.trailerUrl} 
                          controls 
                          controlsList="nodownload"
                          className={styles.iframe}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
                          poster={project.bannerUrl || undefined}
                        ></video>
                      )}
                    </div>
                    <div className={styles.trailerTitle}>
                        <h3>{project.title}</h3>
                        <p>Watch Trailer</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noTrailers}>
                <p>No trailers uploaded yet. Stay tuned!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
