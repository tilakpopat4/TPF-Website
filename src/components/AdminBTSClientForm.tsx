'use client';

import { addBTS, deleteBTS } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useTransition } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

export default function AdminBTSClientForm({ btsItems }: { btsItems: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [items, setItems] = useState(btsItems);
  const [isDeleting, startDelete] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;

    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;
      if (!title) { alert('Please enter a title.'); return; }

      const submitData = new FormData();
      submitData.append('title', title);
      if (videoUrl) submitData.append('videoUrl', videoUrl);
      if (thumbnail) submitData.append('thumbnail', thumbnail);

      await addBTS(submitData);
      form.reset();
      setVideoUrl(null);
      setThumbnail(null);
      alert('BTS content added! Refresh the page to see the new entry.');
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (id: string) => {
    startDelete(async () => {
      await deleteBTS(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="title" placeholder="BTS Title" required className={styles.input} />

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            YouTube URL (paste link here)
          </p>
          <input
            name="videoUrlInput"
            placeholder="https://youtube.com/watch?v=..."
            className={styles.input}
            onChange={(e) => {
              const val = e.target.value;
              if (val && (val.includes('youtube') || val.includes('youtu.be'))) {
                setVideoUrl(val);
              }
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            OR upload a video file
          </p>
          {videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be') ? (
            <p style={{ color: 'green', fontSize: '0.8rem' }}>✓ Video uploaded</p>
          ) : (
            <UploadDropzone
              endpoint="videoUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) setVideoUrl(res[0].url);
              }}
              onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
            />
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Thumbnail (Optional)
          </p>
          {thumbnail ? (
            <div className={styles.formPreview}>
              <img src={thumbnail} alt="BTS Thumbnail" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            </div>
          ) : (
            <CropUploadField label="BTS Thumbnail" onUploadComplete={(url) => setThumbnail(url)} />
          )}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? 'Adding...' : 'Add BTS Securely'}
        </button>
      </form>

      {/* Existing BTS List */}
      <div className={styles.list} style={{ marginTop: '1.5rem' }}>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No BTS content yet.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className={styles.listItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{item.title}</strong>
                <p className={styles.itemMeta}>{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className={styles.deleteBtn}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
