'use client';

import { updateSetting } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';

export default function AdminSpotifyForm({ currentUrl }: { currentUrl: string }) {
  const [isPending, setIsPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [url, setUrl] = useState(currentUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setSaved(false);
    try {
      const input = (e.currentTarget.elements.namedItem('spotifyUrl') as HTMLInputElement).value.trim();
      await updateSetting('spotifyUrl', input);
      setUrl(input);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save Spotify URL.');
    } finally {
      setIsPending(false);
    }
  };

  // Helper: extract Spotify embed URL from any Spotify link
  const getEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return null;
    // Convert share URL to embed URL
    // e.g. https://open.spotify.com/episode/xxx or /show/xxx or /playlist/xxx
    const match = rawUrl.match(/open\.spotify\.com\/(episode|show|playlist|track|album)\/([a-zA-Z0-9]+)/);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Spotify URL (episode, show, playlist, or track)
          </label>
          <input
            name="spotifyUrl"
            defaultValue={currentUrl}
            placeholder="https://open.spotify.com/episode/..."
            required
            className={styles.input}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            Paste any Spotify link — episode link shows one episode, show link auto-updates with new releases.
          </p>
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? 'Saving...' : saved ? '✓ Saved!' : 'Save Spotify Link'}
        </button>
      </form>

      {/* Live Preview */}
      {embedUrl && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Preview
          </p>
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: '12px' }}
            title="Spotify Preview"
          ></iframe>
        </div>
      )}
    </div>
  );
}
