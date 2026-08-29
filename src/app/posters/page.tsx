import prisma from "@/lib/prisma"
import Image from "next/image"
import styles from "./page.module.css"
import DownloadButton from "@/components/DownloadButton"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cinematic Poster Work & Visual Designs',
  description: 'Explore custom poster designs, visual key-art, and cinematic marketing assets created by Tilak Popat Films (TPF).',
}

export default async function PostersPage() {
  let posters: any[] = [];
  try {
    posters = await prisma.poster.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  } catch (e) {
    console.error('Posters table or DB not available:', e);
  }

  return (
    <main className={styles.main}>
      <div className="container" style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
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
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  width={600} 
                  height={900}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={styles.posterImage}
                  quality={85}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto' }}
                />
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
