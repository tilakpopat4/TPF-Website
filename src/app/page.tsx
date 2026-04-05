import Image from "next/image";
import styles from "./page.module.css";
import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projectsCount = await prisma.project.count();
  const projects = projectsCount === 0 
    ? [
        { id: '1', title: 'The Echoes of Silence', description: 'A gripping thriller by TPF.', trailerUrl: '', bannerUrl: '' },
        { id: '2', title: 'Neon Nights', description: 'Cyberpunk short film.', trailerUrl: '', bannerUrl: '' }
      ]
    : await prisma.project.findMany({ take: 2, orderBy: { createdAt: 'desc' } });

  // Main Trailer to display
  const mainTrailer = projects[0]?.trailerUrl || "";

  return (
    <div className={styles.main}>
      {/* Dynamic Animated Hero Section */}
      <Hero />

      {/* Projects Section */}
      <section id="projects" className="section container">
        <div className={styles.sectionHeader}>
          <h2>Featured <span className="text-gradient">Projects</span></h2>
          <div className={styles.line}></div>
        </div>

        <div className={styles.projectsGrid}>
          {projects.map((project: any, idx: number) => (
            <div key={project.id} className={`${styles.projectCard} glass`}>
              <div 
                className={styles.projectImagePlaceholder} 
                style={project.bannerUrl ? { backgroundImage: `url(${project.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'transparent' } : {}}
              >
                {!project.bannerUrl && <span className={styles.projectNumber}>0{idx + 1}</span>}
              </div>
              <div className={styles.projectInfo}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Player Section */}
      <section className={styles.trailerSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Latest <span className="text-gradient">Trailer</span></h2>
            <div className={styles.line}></div>
          </div>
          
          <div className={styles.playerContainer}>
            <div className={styles.playerWrapper}>
              {mainTrailer ? (
                <video 
                  src={mainTrailer} 
                  controls 
                  controlsList="nodownload"
                  className={styles.iframe}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
                  poster={projects[0]?.bannerUrl || undefined}
                ></video>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                  <p>No trailer uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
