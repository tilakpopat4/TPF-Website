'use client';

import { addProject } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

export default function AdminClientForm() {
  const [isPending, setIsPending] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

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
      if (trailerUrl) submitData.append('trailerUrl', trailerUrl);
      if (bannerUrl) submitData.append('bannerUrl', bannerUrl);
      
      const youtubeUrl = (form.elements.namedItem('youtubeUrl') as HTMLInputElement).value;
      const releaseDate = (form.elements.namedItem('releaseDate') as HTMLInputElement).value;
      
      if (youtubeUrl) submitData.append('youtubeUrl', youtubeUrl);
      if (releaseDate) submitData.append('releaseDate', releaseDate);

      await addProject(submitData);
      form.reset();
      setTrailerUrl(null);
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="title" placeholder="Project Title" required className={styles.input} />
        <input name="description" placeholder="Description" required className={styles.input} />
        <input name="youtubeUrl" placeholder="YouTube URL (Optional)" className={styles.input} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Release Date (Optional)</label>
          <input name="releaseDate" type="date" className={styles.input} />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Trailer Video (Optional)</p>
          {trailerUrl ? (
            <p style={{ color: "green", fontSize: "0.9rem" }}>✓ Trailer uploaded</p>
          ) : (
            <UploadDropzone
              endpoint="videoUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) setTrailerUrl(res[0].url);
                alert("Trailer uploaded successfully");
              }}
              onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
            />
          )}
        </div>

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
