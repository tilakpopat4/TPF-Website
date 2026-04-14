'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import styles from '@/app/page.module.css';

// Type for particle
type Particle = { id: number; y: number; x: number; scale: number; dur: number; delay: number };

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Direct link to the locally downloaded TPF logo
  const logoUrl = "/tpf-logo-new.png";

  // Particle generator
  const [particles, setParticles] = useState<Particle[]>([]);
  const [time, setTime] = useState("00:00:00:00");
  
  useEffect(() => {
    // Animate timecode (simulating 24fps)
    const interval = setInterval(() => {
      const date = new Date();
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      const f = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      setTime(`${h}:${m}:${s}:${f}`);
    }, 41);

    setParticles(Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      y: Math.random() * 800 - 400,
      x: Math.random() * 1600 - 800,
      scale: Math.random() * 0.4 + 0.2,
      dur: Math.random() * 10 + 10,
      delay: Math.random() * 5
    })));

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className={styles.hero} style={{ perspective: "1000px" }}>
      {/* Heavy Motion Background */}
      <motion.div 
        className={styles.heroBackground} 
        style={{ y: backgroundY }}
      >
        <div className={styles.lightLeak}></div>
        <div className={styles.lightRay}></div>
        <div className={styles.vignette}></div>
        <div className={styles.grain}></div>
        
        {/* Viewfinder Elements */}
        <div className={styles.viewfinder}>
          <div className={`${styles.bracket} ${styles.topLeft}`}></div>
          <div className={`${styles.bracket} ${styles.topRight}`}></div>
          <div className={`${styles.bracket} ${styles.bottomLeft}`}></div>
          <div className={`${styles.bracket} ${styles.bottomRight}`}></div>
        </div>

        <div className={styles.recIndicator}>
            <div className={styles.recDot}></div>
            <span>REC</span>
        </div>

        <div className={styles.timecode}>{time}</div>

        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.filmStripAnim}></div>

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={styles.particle}
            initial={{ 
              opacity: 0, 
              y: p.y, 
              x: p.x,
              scale: p.scale
            }}
            animate={{ 
              opacity: [0, 0.8, 1, 0.8, 0],
              y: [p.y, p.y - 300, p.y - 600],
              x: [p.x, p.x + 100, p.x - 50]
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay
            }}
          />
        ))}
      </motion.div>
      
      {/* Foreground Content with Parallax & Motion */}
      <motion.div 
        className={`container ${styles.heroContent}`} 
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
          whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.5, delay: 0.3 }}
          style={{ transformStyle: "preserve-3d" }}
          className={styles.logoContainer}
        >
          {/* Continuous Floating Motion */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotateX: [0, 5, -5, 0],
              rotateY: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Main Logo Image */}
            <img 
              src={logoUrl} 
              alt="TPF Logo" 
              className={styles.mainLogo}
            />
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
          Explore Work
        </motion.a>
      </motion.div>
    </section>
  );
}
