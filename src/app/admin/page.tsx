// UPDATED ADMIN PORTAL - REFRESH BROWSER (CTRL+F5)
import prisma from "@/lib/prisma"
import styles from "./page.module.css"
import AdminClientForm from "@/components/AdminClientForm"
import AdminMusicClientForm from "@/components/AdminMusicClientForm"
import AdminCastCrewClientForm from "@/components/AdminCastCrewClientForm"
import AdminPosterClientForm from "@/components/AdminPosterClientForm"
import AdminAnnouncementClientForm from "@/components/AdminAnnouncementClientForm"
import AdminBTSClientForm from "@/components/AdminBTSClientForm"
import AdminSpotifyForm from "@/components/AdminSpotifyForm"
import AdminLatestCreationForm from "@/components/AdminLatestCreationForm"
import AdminVisionForm from "@/components/AdminVisionForm"
import AdminYouTubeChannelForm from "@/components/AdminYouTubeChannelForm"

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
    <div className={`container ${styles.adminPanel}`}>
      <div className={styles.header}>
        <h1 className="text-gradient">Admin Dashboard</h1>
        <p>Manage TPF Website Content &amp; Sequences</p>
      </div>

      <div className={styles.grid}>

        {/* Vision / TPF Cinemas Section */}
        <section className={`${styles.card} glass`}>
          <h2>🎥 TPF Cinemas — Vision &amp; Logo</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Upload or set the dark and light mode logos and tagline for the TPF Cinemas &ldquo;An OTT For Beginners&rdquo; vision page.
          </p>
          <AdminVisionForm currentLogoUrl={visionLogoUrl} currentLogoLightUrl={visionLogoLightUrl} currentTagline={visionTagline} />
        </section>

        {/* YouTube Channel Settings Section */}
        <section className={`${styles.card} glass`}>
          <h2>🔴 Official YouTube Channel Settings</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Configure your YouTube channel handle, live stats, and optional YouTube Data API key.
          </p>
          <AdminYouTubeChannelForm 
            currentHandle={youtubeHandle} 
            currentApiKey={youtubeApiKey}
            currentSubscribers={youtubeSubscribers}
            currentVideoCount={youtubeVideoCount}
          />
        </section>

        {/* Latest Creation Section */}
        <section className={`${styles.card} glass`}>
          <h2>🎬 Latest Creation (Homepage Feature)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Set a YouTube video to show as a big featured player on the homepage, right below the logo.
          </p>
          <AdminLatestCreationForm currentUrl={latestCreationUrl} currentTitle={latestCreationTitle} />
        </section>

        {/* Projects Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Projects</h2>
          <AdminClientForm initialProjects={projects} />
        </section>

        {/* Spotify Settings Section */}
        <section className={`${styles.card} glass`}>
          <h2>🎵 Spotify Player</h2>
          <AdminSpotifyForm currentUrl={spotifyUrl} />
        </section>

        {/* Behind The Scenes Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Behind The Scenes</h2>
          <AdminBTSClientForm btsItems={bts} />
        </section>

        {/* Music Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Music</h2>
          <AdminMusicClientForm initialMusic={music} />
        </section>

        {/* Cast & Crew Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Cast & Crew</h2>
          <AdminCastCrewClientForm initialCrew={crew} />
        </section>

        {/* Poster Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Poster Work</h2>
          <AdminPosterClientForm initialPosters={posters} />
        </section>

        {/* Announcements Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Announcements</h2>
          <AdminAnnouncementClientForm initialAnnouncements={announcements} />
        </section>

      </div>
    </div>
  )
}
