import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projectsCount = await prisma.project.count();
  const projects = projectsCount === 0 
    ? [
        { id: '1', title: 'Mahkatara Projects', description: 'A gripping thriller by TPF.', trailerUrl: '', bannerUrl: '' },
        { id: '2', title: 'The Wakation', description: 'Cyberpunk short film.', trailerUrl: '', bannerUrl: '' },
        { id: '3', title: 'Sanidanoial Movies', description: 'A classic cinematic journey.', trailerUrl: '', bannerUrl: '' },
        { id: '4', title: 'Thkfilm Projects', description: 'Visual narrative showcase.', trailerUrl: '', bannerUrl: '' }
      ]
    : await prisma.project.findMany({ take: 4, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });

  return (
    <div className={styles.main}>
      {/* Dynamic Animated Widescreen Hero Section with filmstrip background */}
      <Hero projects={projects} />

      {/* Featured Projects horizontal grid section */}
      <section id="projects" className="section container" style={{ padding: '6rem 0 8rem 0' }}>
        <div className={styles.sectionHeader}>
          <h2>Featured <span className="text-gradient">Portfolio</span></h2>
          <div className={styles.line}></div>
        </div>
        
        <ProjectsGrid projects={projects} />
      </section>
    </div>
  );
}
