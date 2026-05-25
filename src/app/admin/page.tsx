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

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const projects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
  const music = await prisma.music.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
  const crew = await prisma.castCrew.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
  const posters = await prisma.poster.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
  const announcements = await prisma.announcement.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
  
  // Wrapped in try-catch: table may not exist yet on first deploy
  let bts: any[] = [];
  try {
    bts = await prisma.behindTheScene.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  } catch (e) {
    console.error('BehindTheScene table not yet created:', e);
  }

  let spotifyUrl = '';
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'spotifyUrl' } });
    spotifyUrl = setting?.value || '';
  } catch (e) {
    console.error('Settings table not yet available:', e);
  }

  let latestCreationUrl = '';
  let latestCreationTitle = '';
  try {
    const urlS = await prisma.settings.findUnique({ where: { key: 'latestCreationUrl' } });
    const titleS = await prisma.settings.findUnique({ where: { key: 'latestCreationTitle' } });
    latestCreationUrl = urlS?.value || '';
    latestCreationTitle = titleS?.value || '';
  } catch (e) {
    console.error('Settings table not yet available:', e);
  }

  return (
    <div className={`container ${styles.adminPanel}`}>
      <div className={styles.header}>
        <h1 className="text-gradient">Admin Dashboard</h1>
        <p>Manage TPF Website Content & Sequences</p>
      </div>

      <div className={styles.grid}>

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
