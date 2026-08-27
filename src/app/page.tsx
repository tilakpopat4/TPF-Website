import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import YouTubeChannel from "@/components/YouTubeChannel";
import ProjectsGrid from "@/components/ProjectsGrid";
import TrailerSection from "@/components/TrailerSection";
import LatestCreation from "@/components/LatestCreation";
import { fetchYouTubeChannel } from "@/lib/youtube";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let projects: any[] = [
    { id: '1', title: 'Mahkatara Projects', description: 'A gripping thriller by TPF.', youtubeUrl: '', bannerUrl: '' },
    { id: '2', title: 'The Wakation', description: 'Cyberpunk short film.', youtubeUrl: '', bannerUrl: '' },
    { id: '3', title: 'Sanidanoial Movies', description: 'A classic cinematic journey.', youtubeUrl: '', bannerUrl: '' },
    { id: '4', title: 'Thkfilm Projects', description: 'Visual narrative showcase.', youtubeUrl: '', bannerUrl: '' }
  ];
  try {
    const projectsCount = await prisma.project.count();
    if (projectsCount > 0) {
      projects = await prisma.project.findMany({ take: 4, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    }
  } catch (e) {
    console.error('Projects table or DB not available:', e);
  }

  let btsItems: any[] = [];
  try {
    btsItems = await prisma.behindTheScene.findMany({ take: 5, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  } catch (e) {
    console.error('BehindTheScene table not yet available:', e);
  }

  let latestCreationUrl = '';
  let latestCreationTitle = '';
  let youtubeHandle = 'tilakpopatfilms';
  let youtubeApiKey = process.env.YOUTUBE_API_KEY;
  let youtubeSubscribers = '';
  let youtubeVideoCount = '';

  try {
    const urlSetting = await prisma.settings.findUnique({ where: { key: 'latestCreationUrl' } });
    const titleSetting = await prisma.settings.findUnique({ where: { key: 'latestCreationTitle' } });
    const ytHandleSetting = await prisma.settings.findUnique({ where: { key: 'youtubeHandle' } });
    const ytApiKeySetting = await prisma.settings.findUnique({ where: { key: 'youtubeApiKey' } });
    const ytSubsSetting = await prisma.settings.findUnique({ where: { key: 'youtubeSubscribers' } });
    const ytVidsSetting = await prisma.settings.findUnique({ where: { key: 'youtubeVideoCount' } });

    latestCreationUrl = urlSetting?.value || '';
    latestCreationTitle = titleSetting?.value || '';
    if (ytHandleSetting?.value) youtubeHandle = ytHandleSetting.value;
    if (ytApiKeySetting?.value) youtubeApiKey = ytApiKeySetting.value;
    if (ytSubsSetting?.value) youtubeSubscribers = ytSubsSetting.value;
    if (ytVidsSetting?.value) youtubeVideoCount = ytVidsSetting.value;
  } catch (e) {
    console.error('Settings table not yet available:', e);
  }

  const channelData = await fetchYouTubeChannel(youtubeApiKey, youtubeHandle, youtubeSubscribers, youtubeVideoCount);

  return (
    <div className={styles.main}>
      {/* Dynamic Animated Widescreen Hero Section with filmstrip background */}
      <Hero projects={projects} />

      {/* Official YouTube Channel Section (Live Stats & Videos) */}
      <YouTubeChannel channelData={channelData} />

      {/* Latest Creation — big YouTube player (shown only when set) */}
      {latestCreationUrl && (
        <LatestCreation youtubeUrl={latestCreationUrl} title={latestCreationTitle} />
      )}

      {/* Featured Projects horizontal grid section */}
      <section id="projects" className="section container" style={{ padding: '6rem 0 8rem 0' }}>
        <div className={styles.sectionHeader}>
          <h2>Featured <span className="text-gradient">Portfolio</span></h2>
          <div className={styles.line}></div>
        </div>
        
        <ProjectsGrid projects={projects} />
      </section>

      {/* Behind the Scenes Section */}
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

