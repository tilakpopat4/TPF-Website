import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import styles from './page.module.css';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Vision | TPF Cinemas — An OTT For Beginners',
  description: 'TPF Cinemas: Screening Beginner Dreams. An OTT platform dedicated to independent and beginner filmmakers.',
};

export default async function VisionPage() {
  let visionLogoUrl = '/tpf-cinemas-logo-white.webp';
  let visionLogoLightUrl = '/tpf-cinemas-logo-light.webp';
  let visionTagline = 'Screening Beginner Dreams.';

  try {
    const logoSetting = await prisma.settings.findUnique({ where: { key: 'visionLogoUrl' } });
    const logoLightSetting = await prisma.settings.findUnique({ where: { key: 'visionLogoLightUrl' } });
    const taglineSetting = await prisma.settings.findUnique({ where: { key: 'visionTagline' } });
    
    if (logoSetting?.value) visionLogoUrl = logoSetting.value;
    if (logoLightSetting?.value) visionLogoLightUrl = logoLightSetting.value;
    if (taglineSetting?.value) visionTagline = taglineSetting.value;
  } catch (e) {
    console.error('Settings table not yet available:', e);
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        {/* ─── Centric Brand Logo (Dark & Light Theme Adaptive) ─── */}
        <div className={styles.logoWrapper}>
          {/* Dark Mode Logo (White version) */}
          <Image 
            src={visionLogoUrl} 
            alt="TPF Cinemas" 
            width={880}
            height={220}
            priority
            quality={90}
            className={styles.brandLogoDark}
          />
          {/* Light Mode Logo (Black version) */}
          <Image 
            src={visionLogoLightUrl} 
            alt="TPF Cinemas" 
            width={880}
            height={220}
            priority
            quality={90}
            className={styles.brandLogoLight}
          />
          <h1 className="sr-only">TPF Cinemas</h1>
        </div>

        {/* ─── Typography ─── */}
        <p className={styles.subtitle}>
          An OTT For Beginners
        </p>

        <p className={styles.tagline}>
          &ldquo;{visionTagline}&rdquo;
        </p>

        <p className={styles.publishingQuote}>
          &ldquo;Publishing Soon&rdquo;
        </p>

        <div className={styles.divider}></div>

        {/* ─── Action ─── */}
        <Link href="/work-with-tpf" className={styles.ctaBtn}>
          Submit Your Work
        </Link>
      </div>
    </main>
  );
}
