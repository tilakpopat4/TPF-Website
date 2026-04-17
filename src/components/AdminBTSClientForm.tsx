'use client';

import { addBTS, deleteBTS } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

export default function AdminBTSClientForm({ btsItems }: { btsItems: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;
      const submitData = new FormData();
      submitData.append('title', title);
      if (videoUrl) submitData.append('videoUrl', videoUrl);
      if (thumbnail) submitData.append('thumbnail', thumbnail);

      await addBTS(submitData);
      form.reset();
      setVideoUrl(null);
      setThumbnail(null);
      alert("BTS content added successfully!");
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>Add Behind The Scenes</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input name="title" placeholder="BTS Title" required className={styles.input} />
          
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Video Content</p>
            {videoUrl ? (
              <p style={{ color: "green", fontSize: "0.8rem" }}>✓ Video uploaded</p>
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

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Thumbnail (Optional)</p>
            {thumbnail ? (
              <div className={styles.formPreview}>
                 <img src={thumbnail} alt="BTS Thumbnail" style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
              </div>
            ) : (
              <CropUploadField
                label="BTS Thumbnail"
                onUploadComplete={(url) => setThumbnail(url)}
              />
            )}
          </div>

          <button type="submit" className={styles.btn} disabled={isPending}>
            {isPending ? "Adding..." : 'Add BTS Securely'}
          </button>
        </form>
      </div>

      <div className={styles.listWrapper}>
        <h3 className={styles.formTitle}>Existing BTS Content</h3>
        <div className={styles.adminList}>
          {btsItems.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.title}</p>
                <span className={styles.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <button 
                onClick={() => deleteBTS(item.id)} 
                className={styles.deleteBtn}
                title="Delete BTS"
              >
                Delete
              </button>
            </div>
          ))}
          {btsItems.length === 0 && <p className={styles.emptyMsg}>No BTS content found.</p>}
        </div>
      </div>
    </div>
  );
}
