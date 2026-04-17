'use client';

import { addProject, fetchYouTubeInfo } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useRef } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

export default function AdminClientForm() {
  const [isPending, setIsPending] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFetchYouTube = async () => {
    const url = (formRef.current?.elements.namedItem('youtubeUrl') as HTMLInputElement).value;
    if (!url) return alert("Please enter a YouTube URL first.");
    
    setIsPending(true);
    const info = await fetchYouTubeInfo(url);
    setIsPending(false);

    if (info) {
      if (formRef.current) {
        (formRef.current.elements.namedItem('title') as HTMLInputElement).value = info.title;
        (formRef.current.elements.namedItem('description') as HTMLTextAreaElement).value = info.description;
      }
    } else {
      alert("Failed to fetch YouTube info. Please enter manually.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;
      const description = (form.elements.namedItem('description') as HTMLInputElement).value;

      // Construct plain text FormData for the lightweight Server Action
      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('description', description);
      if (bannerUrl) submitData.append('bannerUrl', bannerUrl);
      
      const youtubeUrl = (form.elements.namedItem('youtubeUrl') as HTMLInputElement).value;
      const releaseDate = (form.elements.namedItem('releaseDate') as HTMLInputElement).value;
      
      if (youtubeUrl) submitData.append('youtubeUrl', youtubeUrl);
      if (releaseDate) submitData.append('releaseDate', releaseDate);

      await addProject(submitData);
      form.reset();
      setBannerUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please check console.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.formWrapper}>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <input name="title" placeholder="Project Title" required className={styles.input} />
        <textarea name="description" placeholder="Description" required className={styles.input} style={{ minHeight: '100px' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input name="youtubeUrl" placeholder="YouTube URL" className={styles.input} style={{ flex: 1 }} />
          <button type="button" onClick={handleFetchYouTube} className={styles.btn} style={{ width: 'auto', padding: '0 1rem' }}>
            Fetch Info
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Release Date (Optional)</label>
          <input name="releaseDate" type="date" className={styles.input} />
        </div>
        
        {/* Trailer upload removed - now in BTS section */}

        <div style={{ marginBottom: "1rem" }}>
          <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Banner Image (Optional)</p>
          {bannerUrl ? (
            <div className={styles.formPreview}>
              <p style={{ color: "green", fontSize: "0.9rem", padding: "10px" }}>✓ Banner adjusted and uploaded</p>
              <img src={bannerUrl} alt="Banner Preview" style={{ width: "100%", height: "auto", maxHeight: "300px", borderRadius: "8px" }} />
            </div>
          ) : (
            <CropUploadField
              label="Banner Image"
              onUploadComplete={(url) => setBannerUrl(url)}
            />
          )}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? "Saving..." : 'Add Project Securely'}
        </button>
      </form>
    </div>
  )
}
