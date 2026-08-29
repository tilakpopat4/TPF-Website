import prisma from "@/lib/prisma"
import styles from "./page.module.css"
import AdminDashboardView from "@/components/AdminDashboardView"

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let projects: any[] = [];
  let music: any[] = [];
  let crew: any[] = [];
  let posters: any[] = [];
  let announcements: any[] = [];
  let bts: any[] = [];

  try {
    projects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    music = await prisma.music.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    crew = await prisma.castCrew.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    posters = await prisma.poster.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    announcements = await prisma.announcement.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    bts = await prisma.behindTheScene.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  } catch (e) {
    console.error('Database query error in admin:', e);
  }

  let spotifyUrl = '';
  let visionLogoUrl = '';
  let visionLogoLightUrl = '';
  let visionTagline = 'Screening Beginner Dreams.';
  let latestCreationUrl = '';
  let latestCreationTitle = '';
  let youtubeHandle = 'tilakpopatfilms';
  let youtubeApiKey = '';
  let youtubeSubscribers = '';
  let youtubeVideoCount = '';

  try {
    const spotifySetting = await prisma.settings.findUnique({ where: { key: 'spotifyUrl' } });
    spotifyUrl = spotifySetting?.value || '';

    const visionLogoSetting = await prisma.settings.findUnique({ where: { key: 'visionLogoUrl' } });
    visionLogoUrl = visionLogoSetting?.value || '';

    const visionLogoLightSetting = await prisma.settings.findUnique({ where: { key: 'visionLogoLightUrl' } });
    visionLogoLightUrl = visionLogoLightSetting?.value || '';

    const visionTaglineSetting = await prisma.settings.findUnique({ where: { key: 'visionTagline' } });
    if (visionTaglineSetting?.value) visionTagline = visionTaglineSetting.value;

    const urlS = await prisma.settings.findUnique({ where: { key: 'latestCreationUrl' } });
    const titleS = await prisma.settings.findUnique({ where: { key: 'latestCreationTitle' } });
    latestCreationUrl = urlS?.value || '';
    latestCreationTitle = titleS?.value || '';

    const ytHandleS = await prisma.settings.findUnique({ where: { key: 'youtubeHandle' } });
    const ytApiKeyS = await prisma.settings.findUnique({ where: { key: 'youtubeApiKey' } });
    const ytSubsS = await prisma.settings.findUnique({ where: { key: 'youtubeSubscribers' } });
    const ytVidsS = await prisma.settings.findUnique({ where: { key: 'youtubeVideoCount' } });
    if (ytHandleS?.value) youtubeHandle = ytHandleS.value;
    if (ytApiKeyS?.value) youtubeApiKey = ytApiKeyS.value;
    if (ytSubsS?.value) youtubeSubscribers = ytSubsS.value;
    if (ytVidsS?.value) youtubeVideoCount = ytVidsS.value;
  } catch (e) {
    console.error('Settings table not yet available:', e);
  }

  return (
    <main className={styles.adminPanel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerBadge}>TPF Studio Management Console</div>
          <h1 className="text-gradient">Admin Dashboard</h1>
          <p>Manage high-fidelity productions, media channels, crew rosters, and live website sequences.</p>
        </div>

        <AdminDashboardView
          projects={projects}
          music={music}
          crew={crew}
          posters={posters}
          announcements={announcements}
          bts={bts}
          spotifyUrl={spotifyUrl}
          visionLogoUrl={visionLogoUrl}
          visionLogoLightUrl={visionLogoLightUrl}
          visionTagline={visionTagline}
          latestCreationUrl={latestCreationUrl}
          latestCreationTitle={latestCreationTitle}
          youtubeHandle={youtubeHandle}
          youtubeApiKey={youtubeApiKey}
          youtubeSubscribers={youtubeSubscribers}
          youtubeVideoCount={youtubeVideoCount}
        />
      </div>
    </main>
  )
}
