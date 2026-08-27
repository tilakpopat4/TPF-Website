'use client';

import { useState } from 'react';
import { updateSetting } from '@/app/admin/actions';
import CropUploadField from './CropUploadField';
import styles from '@/app/admin/page.module.css';

interface Props {
  currentLogoUrl: string;
  currentLogoLightUrl: string;
  currentTagline: string;
}

export default function AdminVisionForm({ currentLogoUrl, currentLogoLightUrl, currentTagline }: Props) {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [logoLightUrl, setLogoLightUrl] = useState(currentLogoLightUrl);
  const [tagline, setTagline] = useState(currentTagline || 'Screening Beginner Dreams.');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateSetting('visionLogoUrl', logoUrl.trim());
    await updateSetting('visionLogoLightUrl', logoLightUrl.trim());
    await updateSetting('visionTagline', tagline.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        {/* Dark Theme Logo (White version) */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>🌙 Dark Mode Logo (White Version)</h3>
          <CropUploadField 
            label="Upload Dark Mode Logo" 
            onUploadComplete={(url) => setLogoUrl(url)}
          />
          <input
            value={logoUrl}
            onChange={(e) => { setLogoUrl(e.target.value); setSaved(false); }}
            placeholder="Direct URL for Dark Mode Logo"
            className={styles.input}
            style={{ marginTop: '0.4rem' }}
          />
          {logoUrl && (
            <div style={{ padding: '1rem', background: '#0a0a0a', borderRadius: '8px', marginTop: '0.5rem', textAlign: 'center' }}>
              <img src={logoUrl} alt="Dark Mode Logo" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          )}
        </div>

        {/* Light Theme Logo (Black version) */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>☀️ Light Mode Logo (Black Version)</h3>
          <CropUploadField 
            label="Upload Light Mode Logo" 
            onUploadComplete={(url) => setLogoLightUrl(url)}
          />
          <input
            value={logoLightUrl}
            onChange={(e) => { setLogoLightUrl(e.target.value); setSaved(false); }}
            placeholder="Direct URL for Light Mode Logo"
            className={styles.input}
            style={{ marginTop: '0.4rem' }}
          />
          {logoLightUrl && (
            <div style={{ padding: '1rem', background: '#f7f4ef', borderRadius: '8px', marginTop: '0.5rem', textAlign: 'center' }}>
              <img src={logoLightUrl} alt="Light Mode Logo" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <p className={styles.label} style={{ marginBottom: '0.4rem' }}>Tagline:</p>
          <input
            value={tagline}
            onChange={(e) => { setTagline(e.target.value); setSaved(false); }}
            placeholder="Screening Beginner Dreams."
            className={styles.input}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button onClick={handleSave} disabled={saving} className={styles.btn}>
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Vision Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
