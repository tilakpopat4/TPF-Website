'use client';

import { useState } from 'react';
import { updateSetting } from '@/app/admin/actions';

interface Props {
  currentHandle?: string;
  currentApiKey?: string;
}

export default function AdminYouTubeChannelForm({ currentHandle = 'tilakpopatfilms', currentApiKey = '' }: Props) {
  const [handle, setHandle] = useState(currentHandle);
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await updateSetting('youtubeHandle', handle.trim().replace(/^@/, ''));
      await updateSetting('youtubeApiKey', apiKey.trim());
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          YouTube Channel Handle / Name
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@</span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="tilakpopatfilms"
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text)',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          YouTube Data API v3 Key (Optional)
        </label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          style={{
            width: '100%',
            padding: '0.65rem 0.9rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--text)',
            fontSize: '0.9rem'
          }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          Live channel metadata and videos are fetched automatically. Adding a Google YouTube API key is optional.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="submit"
          disabled={status === 'saving'}
          style={{
            padding: '0.7rem 1.5rem',
            borderRadius: '6px',
            background: '#ff0000',
            color: '#fff',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {status === 'saving' ? 'Saving...' : 'Save YouTube Settings'}
        </button>
        {status === 'saved' && <span style={{ color: '#4ade80', fontSize: '0.85rem' }}>✓ Saved!</span>}
        {status === 'error' && <span style={{ color: '#f87171', fontSize: '0.85rem' }}>Failed to save.</span>}
      </div>
    </form>
  );
}
