'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdSenseUnitProps {
  /** Ad slot ID generated in your Google AdSense dashboard (e.g. "1234567890") */
  slot: string;
  /** Layout format: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical' */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  /** Responsive full width */
  responsive?: 'true' | 'false';
  /** Optional custom styling for the container */
  style?: React.CSSProperties;
  /** Optional CSS class name */
  className?: string;
}

export default function AdSenseUnit({
  slot,
  format = 'auto',
  responsive = 'true',
  style = { display: 'block' },
  className = '',
}: AdSenseUnitProps) {
  const adPushedRef = useRef(false);

  useEffect(() => {
    // Only push once per mounted ad unit to prevent duplicate push errors
    if (!adPushedRef.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushedRef.current = true;
      } catch (err) {
        console.warn('AdSense ad push warning:', err);
      }
    }
  }, []);

  return (
    <div
      className={`tpf-adsense-container ${className}`}
      style={{
        width: '100%',
        overflow: 'hidden',
        textAlign: 'center',
        margin: '2rem auto',
        minHeight: '90px',
      }}
    >
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3956092062491313"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
