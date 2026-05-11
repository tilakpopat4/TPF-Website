import styles from './Footer.module.css';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/tilakpopatfilms',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@tilakpopatfilms',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:tilakpopatfilms@gmail.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="3"/>
        <polyline points="2,4 12,13 22,4"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Top divider with glow */}
      <div className={styles.divider} />

      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandName}>TPF</span>
          <span className={styles.brandTag}>Tilak Popat Films</span>
        </div>

        {/* Social Icons */}
        <div className={styles.socials}>
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className={styles.socialLink}
              aria-label={label}
              title={label}
            >
              {icon}
              <span className={styles.socialLabel}>{label}</span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className={styles.copy}>
          © {year} Tilak Popat Films. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
