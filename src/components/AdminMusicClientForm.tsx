'use client';

import { addMusic } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

export default function AdminMusicClientForm() {
  const [isPending, setIsPending] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;

      if (!audioUrl) {
        alert("You must upload an Audio file!");
        setIsPending(false);
        return;
      }

      // Construct plain text FormData for the lightweight Server Action
      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('audioUrl', audioUrl);
      if (posterUrl) submitData.append('posterUrl', posterUrl);

      await addMusic(submitData);
      form.reset();
      setAudioUrl(null);
      setPosterUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please check console.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="title" placeholder="Music Title" required className={styles.input} />
      
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Audio File (Required)</p>
        {audioUrl ? (
          <p style={{ color: "green", fontSize: "0.9rem" }}>✓ Audio uploaded</p>
        ) : (
          <UploadDropzone
            endpoint="audioUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) setAudioUrl(res[0].url);
              alert("Audio uploaded successfully");
            }}
            onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
          />
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Poster Image (Optional)</p>
        {posterUrl ? (
          <div className={styles.formPreview}>
            <p style={{ color: "green", fontSize: "0.9rem", padding: "10px" }}>✓ Poster adjusted and uploaded</p>
            <img src={posterUrl} alt="Poster Preview" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
          </div>
        ) : (
          <CropUploadField
            label="Poster Image"
            onUploadComplete={(url) => setPosterUrl(url)}
          />
        )}
      </div>

      <button type="submit" className={styles.btn} disabled={isPending || !audioUrl}>
        {isPending ? "Saving..." : 'Add Music Securely'}
      </button>
    </form>
  )
}
