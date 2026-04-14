'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" onClick={closeMenu}>
            <span className="text-gradient">TPF</span>
          </Link>
        </div>

        {/* Hamburger Menu Toggle */}
        <button 
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.link} onClick={closeMenu}>Home</Link>
          <Link href="/announcements" className={styles.link} onClick={closeMenu}>Announcements</Link>
          <Link href="/posters" className={styles.link} onClick={closeMenu}>Poster Work</Link>
          <Link href="/music" className={styles.link} onClick={closeMenu}>TPF Music</Link>
          <Link href="/cast-crew" className={styles.link} onClick={closeMenu}>Cast & Crew</Link>
          <Link href="/work-with-tpf" className={`${styles.link} ${styles.cta}`} onClick={closeMenu}>Work with TPF</Link>
        </div>
      </div>
    </nav>
  );
}
