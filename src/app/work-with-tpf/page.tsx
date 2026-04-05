import Navbar from "@/components/Navbar"
import styles from "./page.module.css"
import RecruitmentForm from "@/components/RecruitmentForm"

export const metadata = {
  title: 'Work with TPF | Recruitment',
  description: 'Join the Tilak Popat Films team as an editor or designer.',
}

export default function WorkWithTPFPage() {
  return (
    <main className={styles.main}>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', maxWidth: '800px' }}>
        <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Work with TPF</h1>
        <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', marginBottom: '3rem' }}>
          We are always looking for talented editors and designers to join our cinematic journey. 
          Fill out the form below and we'll get back to you.
        </p>

        <section className={`${styles.formSection} glass`}>
          <RecruitmentForm />
        </section>
      </div>
    </main>
  )
}
