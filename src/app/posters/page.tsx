import prisma from "@/lib/prisma"
import styles from "./page.module.css"
import Navbar from "@/components/Navbar"
import DownloadButton from "@/components/DownloadButton"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cinematic Poster Work & Visual Designs',
  description: 'Explore custom poster designs, visual key-art, and cinematic marketing assets created by Tilak Popat Films (TPF).',
}

export default async function PostersPage() {
  const posters = await prisma.poster.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })

  return (
    <main className={styles.main}>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Poster Work</h1>
        <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', marginBottom: '3rem' }}>
          Visual identity and cinematic poster designs for our productions.
        </p>

        {posters.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '4rem' }}>No posters added yet.</p>
        ) : (
          <div className={styles.posterGrid}>
            {posters.map((post) => (
              <div key={post.id} className={styles.posterCard}>
                <img src={post.imageUrl} alt={post.title} className={styles.posterImage} />
                <div className={styles.posterOverlay}>
                  <h3>{post.title}</h3>
                  <DownloadButton 
                    imageUrl={post.imageUrl} 
                    title={post.title} 
                    className={styles.downloadBtn} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
