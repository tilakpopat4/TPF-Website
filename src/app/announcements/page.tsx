import prisma from "@/lib/prisma"
import styles from "./page.module.css"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Announcements | Tilak Popat Films',
  description: 'Latest news, upcoming projects, and studio updates from TPF.',
}

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
  const upcomingProjects = await prisma.project.findMany({
    where: { releaseDate: { gte: new Date() } },
    orderBy: { releaseDate: 'asc' }
  })

  return (
    <main className={styles.main}>
      <div className="container" style={{ paddingTop: '120px' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          Announcements
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem' }}>
          Stay updated with the latest news and upcoming releases from TPF.
        </p>

        <div className={styles.feed}>

          {/* Studio News */}
          {announcements.length === 0 && upcomingProjects.length === 0 ? (
            <p className={styles.emptyMsg}>Nothing here yet — check back soon!</p>
          ) : (
            <>
              {announcements.map((ann) => (
                <article key={ann.id} className={`${styles.card} glass`}>
                  {ann.imageUrl && (
                    <div className={styles.imageWrapper}>
                      <img src={ann.imageUrl} alt={ann.title} className={styles.cardImage} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.meta}>
                      <span className={styles.tag}>Studio News</span>
                      <span className={styles.date}>{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{ann.title}</h3>
                    <p className={styles.cardText}>{ann.content}</p>
                  </div>
                </article>
              ))}

              {upcomingProjects.map((project) => (
                <article key={project.id} className={`${styles.card} glass`}>
                  <div className={styles.cardBody}>
                    <div className={styles.meta}>
                      <span className={`${styles.tag} ${styles.tagUpcoming}`}>Coming Soon</span>
                      <span className={styles.date}>
                        {new Date(project.releaseDate!).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    {project.description && (
                      <p className={styles.cardText}>{project.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
