'use client';

import { addPoster } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';
import CropUploadField from './CropUploadField';

export default function AdminPosterClientForm() {
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;

      if (!imageUrl) {
        alert("Please upload a poster image first.");
        return;
      }

      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('imageUrl', imageUrl);

      await addPoster(submitData);
      form.reset();
      setImageUrl(null);
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
        <input name="title" placeholder="Poster Title" required className={styles.input} />
        
        {imageUrl ? (
          <div className={styles.formPreview}>
               <p style={{ color: "green", fontSize: "0.9rem", padding: "10px" }}>✓ Poster adjusted and uploaded</p>
               <img src={imageUrl} alt="Poster Preview" style={{ width: "100%", height: "auto", maxHeight: "300px", borderRadius: "8px" }} />
          </div>
        ) : (
          <CropUploadField
            label="Poster Image"
            onUploadComplete={(url) => setImageUrl(url)}
          />
        )}

        <button type="submit" className={styles.btn} disabled={isPending || !imageUrl}>
          {isPending ? "Saving..." : 'Add Poster Securely'}
        </button>
      </form>
    </div>
  )
}
