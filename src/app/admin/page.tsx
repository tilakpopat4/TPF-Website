import prisma from "@/lib/prisma"
import { deleteProject, deleteMusic, addCastCrew, deleteCastCrew, deletePoster } from "./actions"
import styles from "./page.module.css"
import AdminClientForm from "@/components/AdminClientForm"
import AdminMusicClientForm from "@/components/AdminMusicClientForm"
import AdminCastCrewClientForm from "@/components/AdminCastCrewClientForm"
import AdminPosterClientForm from "@/components/AdminPosterClientForm"

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  const music = await prisma.music.findMany({ orderBy: { createdAt: 'desc' } })
  const crew = await prisma.castCrew.findMany({ orderBy: { createdAt: 'desc' } })
  const posters = await prisma.poster.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className={`container ${styles.adminPanel}`}>
      <div className={styles.header}>
        <h1 className="text-gradient">Admin Dashboard</h1>
        <p>Manage TPF Website Content</p>
      </div>

      <div className={styles.grid}>
        {/* Projects Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Projects</h2>
          <AdminClientForm />

          <div className={styles.list}>
            {projects.map((p: any) => (
              <div key={p.id} className={styles.listItem}>
                <div>
                  <strong>{p.title}</strong>
                  <p className={styles.itemMeta}>{p.description}</p>
                </div>
                <form action={async () => { 'use server'; await deleteProject(p.id) }}>
                  <button className={styles.deleteBtn}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* Music Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Music</h2>
          <AdminMusicClientForm />

          <div className={styles.list}>
            {music.map((m: any) => (
              <div key={m.id} className={styles.listItem}>
                <div>
                  <strong>{m.title}</strong>
                </div>
                <form action={async () => { 'use server'; await deleteMusic(m.id) }}>
                  <button className={styles.deleteBtn}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* Cast & Crew Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Cast & Crew</h2>
          <AdminCastCrewClientForm />

          <div className={styles.list}>
            {crew.map((c: any) => (
              <div key={c.id} className={styles.listItem}>
                <div>
                  <strong>{c.name}</strong>
                  <p className={styles.itemMeta}>{c.role}</p>
                </div>
                <form action={async () => { 'use server'; await deleteCastCrew(c.id) }}>
                  <button className={styles.deleteBtn}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        {/* Poster Section */}
        <section className={`${styles.card} glass`}>
          <h2>Manage Poster Work</h2>
          <AdminPosterClientForm />

          <div className={styles.list}>
            {posters.map((post: any) => (
              <div key={post.id} className={styles.listItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={post.imageUrl} alt={post.title} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                  <strong>{post.title}</strong>
                </div>
                <form action={async () => { 'use server'; await deletePoster(post.id) }}>
                  <button className={styles.deleteBtn}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
