import prisma from "@/lib/prisma"
import styles from "./page.module.css"
import Navbar from "@/components/Navbar"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Announcements | Tilak Popat Films',
  description: 'Latest news, upcoming projects, and studio updates from TPF.',
}

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
  const upcomingProjects = await prisma.project.findMany({ 
    where: { 
      releaseDate: { 
        gte: new Date() 
      } 
    },
    orderBy: { releaseDate: 'asc' } 
  })

  return (
    <main className={styles.main}>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Latest Announcements</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem' }}>
          Stay updated with the latest news and upcoming releases from TPF.
        </p>

        <div className={styles.contentGrid}>
          {/* Main News Feed */}
          <section className={styles.newsSection}>
            <h2 className={styles.sectionTitle}>Studio News</h2>
            {announcements.length === 0 ? (
              <p className={styles.emptyMsg}>No announcements yet. Check back soon!</p>
            ) : (
              <div className={styles.newsList}>
                {announcements.map((ann) => (
                  <article key={ann.id} className={`${styles.newsCard} glass`}>
                    {ann.imageUrl && (
                      <div className={styles.newsImageWrapper}>
                        <img src={ann.imageUrl} alt={ann.title} className={styles.newsImage} />
                      </div>
                    )}
                    <div className={styles.newsContent}>
                      <span className={styles.date}>{new Date(ann.createdAt).toLocaleDateString()}</span>
                      <h3>{ann.title}</h3>
                      <p>{ann.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming Projects Sidebar/Section */}
          <section className={styles.upcomingSection}>
            <h2 className={styles.sectionTitle}>Upcoming Releases</h2>
            {upcomingProjects.length === 0 ? (
              <p className={styles.emptyMsg}>No upcoming projects announced yet.</p>
            ) : (
              <div className={styles.upcomingList}>
                {upcomingProjects.map((project) => (
                  <div key={project.id} className={`${styles.upcomingCard} glass`}>
                        <div className={styles.projectHeader}>
                            <h4>{project.title}</h4>
                            <span className={styles.releaseTag}>COMING SOON</span>
                        </div>
                        <p>{project.description}</p>
                        <div className={styles.countdown}>
                            <span>Release Date:</span>
                            <strong>{new Date(project.releaseDate!).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                        </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
