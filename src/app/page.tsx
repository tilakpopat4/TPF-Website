import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import HomeTabs from "@/components/HomeTabs";
import TrailerSection from "@/components/TrailerSection";
import LatestCreation from "@/components/LatestCreation";
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
    : await prisma.project.findMany({ take: 10, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });

  const announcements = await prisma.announcement.findMany({ take: 3, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  
  let btsItems: any[] = [];
  try {
    btsItems = await prisma.behindTheScene.findMany({ take: 5, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  } catch (e) {
    console.error('BehindTheScene table not yet available:', e);
  }

  let latestCreationUrl = '';
  let latestCreationTitle = '';
  try {
    const urlSetting = await prisma.settings.findUnique({ where: { key: 'latestCreationUrl' } });
    const titleSetting = await prisma.settings.findUnique({ where: { key: 'latestCreationTitle' } });
    latestCreationUrl = urlSetting?.value || '';
    latestCreationTitle = titleSetting?.value || '';
  } catch (e) {
    console.error('Settings table not yet available:', e);
  }

  return (
    <div className={styles.main}>
      {/* Dynamic Animated Hero Section */}
      <Hero />

      {/* Latest Creation — big YouTube player (shown only when set) */}
      {latestCreationUrl && (
        <LatestCreation youtubeUrl={latestCreationUrl} title={latestCreationTitle} />
      )}
      {/* Tabbed Content Section (Projects & Announcements) */}
      <section id="projects" className="section container">
        <HomeTabs initialProjects={projects} announcements={announcements} />
      </section>

      {/* Video Player Section */}
      <section className={styles.trailerSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Explore <span className="text-gradient">Behind The Scenes</span></h2>
            <div className={styles.line}></div>
          </div>
          
          <div className={styles.scrollWrapper}>
            <TrailerSection btsItems={btsItems} />
          </div>
        </div>
      </section>
    </div>
  );
}
