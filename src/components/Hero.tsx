'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import styles from '@/app/page.module.css';
import { useTheme } from './ThemeProvider';

interface HeroProps {
  projects?: any[];
}

export default function Hero({ projects = [] }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use top 3 projects, or 3 mock objects if empty
  const filmstripItems = projects.length > 0 
    ? projects.slice(0, 3) 
    : [null, null, null];
  const loopedItems = [...filmstripItems, ...filmstripItems];
  
  // High-quality cinematic backup images in case database is empty
  const defaultFrames = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542204172-e70528091b50?q=80&w=800&auto=format&fit=crop"
  ];

  return (
    <section ref={ref} className={styles.hero} style={{ perspective: "1000px" }}>
      {/* Cinematic Filmstrip Background */}
      <motion.div 
        className={styles.heroBackground} 
        style={{ y: backgroundY }}
      >
        <div className={styles.filmstripWrapper}>
          <div className={styles.filmstripTrack}>
            {loopedItems.map((project, index) => {
              const defaultIndex = index % 3;
              const imageUrl = project?.bannerUrl || defaultFrames[defaultIndex];
              return (
                <div 
                  key={index} 
                  className={styles.filmstripFrame}
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              );
            })}
          </div>
        </div>
        
        <div className={styles.vignette}></div>
        <div className={styles.grain}></div>
        
        {/* Viewfinder Elements */}
        <div className={styles.viewfinder}>
          <div className={`${styles.bracket} ${styles.topLeft}`}></div>
          <div className={`${styles.bracket} ${styles.topRight}`}></div>
          <div className={`${styles.bracket} ${styles.bottomLeft}`}></div>
          <div className={`${styles.bracket} ${styles.bottomRight}`}></div>
        </div>

        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.filmStripAnim}></div>
        
        {/* Widescreen borders */}
        <div className={styles.letterboxTop}></div>
        <div className={styles.letterboxBottom}></div>
      </motion.div>
      
      {/* Foreground Content with Parallax & Motion */}
      <motion.div 
        className={`container ${styles.heroContent}`} 
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div
          initial={{ filter: "blur(25px)", opacity: 0, scale: 0.85 }}
          animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className={styles.logoContainer}
        >
          {/* Continuous Floating Motion */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 0.5, -0.5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Stacked Logos for instant zero-delay theme switching */}
            <div style={{ display: 'grid', placeItems: 'center', position: 'relative' }}>
              {/* Dark Theme Logo (White) */}
              <img 
                src="/tpf-logo-new.png" 
                alt="TPF Logo" 
                className={styles.mainLogo}
                style={{ 
                  gridArea: '1 / 1',
                  opacity: mounted && theme === 'light' ? 0 : 1,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: mounted && theme === 'light' ? 'none' : 'auto'
                }}
              />
              {/* Light Theme Logo (Black) */}
              <img 
                src="/tpf-logo-light.png" 
                alt="TPF Logo Light" 
                className={styles.mainLogo}
                style={{ 
                  gridArea: '1 / 1',
                  opacity: mounted && theme === 'light' ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  transform: 'scale(1.33)',
                  pointerEvents: mounted && theme === 'light' ? 'auto' : 'none'
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.p 
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Crafting cinematic experiences that transcend reality.
        </motion.p>
        
        <motion.a 
          href="#projects" 
          className={styles.ctaButton + " cinematic-glow"}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          View Our Portfolio
        </motion.a>
      </motion.div>
    </section>
  );
}
