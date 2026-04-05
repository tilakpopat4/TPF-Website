import Image from "next/image";
import styles from "./page.module.css";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function CastCrewPage() {
  const crewCount = await prisma.castCrew.count();
  const teamMembers = crewCount === 0
    ? [
        { id: '1', name: 'Tilak Popat', role: 'Director / Founder', imageUrl: 'https://images.unsplash.com/photo-1544168190-79c15427015f?auto=format&fit=crop&q=80&w=400' },
        { id: '2', name: 'John Doe', role: 'Cinematographer', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
        { id: '3', name: 'Jane Smith', role: 'Lead Actress', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
        { id: '4', name: 'Alex Johnson', role: 'Music Composer', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400' }
      ]
    : await prisma.castCrew.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className={styles.main}>
      <section className="container section">
        <div className={styles.header}>
          <h2>Meet The <span className="text-gradient">Team</span></h2>
          <p>The visionaries behind the lens and on the screen.</p>
          <div className="line" style={{ margin: '1rem auto 0' }}></div>
        </div>

        <div className={styles.grid}>
          {teamMembers.map((member: any) => (
            <div key={member.id} className={`${styles.profileCard} glass`}>
              <div className={styles.imageWrapper}>
                <img 
                  src={member.imageUrl || 'https://images.unsplash.com/photo-1544168190-79c15427015f?auto=format&fit=crop&q=80&w=400'} 
                  alt={member.name} 
                  className={styles.profileImage}
                />
                <div className={styles.overlay}>
                  <div className={styles.socials}>
                    <span>IG</span>
                  </div>
                </div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
