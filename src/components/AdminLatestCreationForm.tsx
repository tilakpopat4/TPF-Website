'use client';

import { useState } from 'react';
import { updateSetting } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';

interface Props {
  currentUrl: string;
  currentTitle: string;
}

export default function AdminLatestCreationForm({ currentUrl, currentTitle }: Props) {
  const [url, setUrl] = useState(currentUrl);
  const [title, setTitle] = useState(currentTitle);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) return alert('Please enter a YouTube URL.');
    setSaving(true);
    await updateSetting('latestCreationUrl', url.trim());
    await updateSetting('latestCreationTitle', title.trim() || 'Latest Creation');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = async () => {
    if (!confirm('Remove the latest creation video from the homepage?')) return;
    setSaving(true);
    await updateSetting('latestCreationUrl', '');
    await updateSetting('latestCreationTitle', '');
    setUrl('');
    setTitle('');
    setSaving(false);
  };

  // Extract video ID for live preview
  const getVideoId = (u: string) => {
    const m = u.match(/(?:youtu\.be\/|v=|embed\/)([^#&?]{11})/);
    return m ? m[1] : null;
  };
  const videoId = getVideoId(url);

  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='Label (e.g. "JUST ONCE — Official Trailer")'
          className={styles.input}
        />
        <input
          value={url}
          onChange={e => { setUrl(e.target.value); setSaved(false); }}
          placeholder="YouTube URL"
          className={styles.input}
        />

        {/* Live preview thumbnail */}
        {videoId && (
          <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt="Preview"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSave} disabled={saving} className={styles.btn}>
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Set as Latest Creation'}
          </button>
          {currentUrl && (
            <button
              onClick={handleClear}
              disabled={saving}
              className={styles.deleteBtn}
              style={{ padding: '0.75rem 1rem' }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
