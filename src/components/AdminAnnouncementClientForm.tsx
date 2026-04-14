'use client';

import { addAnnouncement } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';
import CropUploadField from './CropUploadField';

export default function AdminAnnouncementClientForm() {
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;
      const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;

      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('content', content);
      if (imageUrl) submitData.append('imageUrl', imageUrl);

      await addAnnouncement(submitData);
      form.reset();
      setImageUrl(null);
      alert("Announcement posted successfully!");
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="title" placeholder="Announcement Title" required className={styles.input} />
        <textarea name="content" placeholder="Content / Details" required className={styles.input} style={{ minHeight: '100px' }} />
        
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Image (Optional)</p>
          {imageUrl ? (
            <div className={styles.formPreview}>
                 <p style={{ color: "green", fontSize: "0.9rem", padding: "10px" }}>✓ Image uploaded</p>
                 <img src={imageUrl} alt="Announcement Preview" style={{ width: "100%", height: "auto", maxHeight: "200px", borderRadius: "8px" }} />
            </div>
          ) : (
            <CropUploadField
              label="Announcement Image"
              onUploadComplete={(url) => setImageUrl(url)}
            />
          )}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Posting..." : 'Post Announcement'}
        </button>
      </form>
    </div>
  )
}
