'use client';

import { addCastCrew } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState } from 'react';
import CropUploadField from './CropUploadField';

export default function AdminCastCrewClientForm() {
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const role = (form.elements.namedItem('role') as HTMLInputElement).value;

      // Construct plain text FormData for the lightweight Server Action
      const submitData = new FormData();
      submitData.append('name', name);
      submitData.append('role', role);
      if (imageUrl) submitData.append('imageUrl', imageUrl);

      await addCastCrew(submitData);
      form.reset();
      setImageUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please check console.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input name="name" placeholder="Name" required className={styles.input} />
      <input name="role" placeholder="Role (e.g. Director)" required className={styles.input} />
      
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "var(--foreground)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Profile Image (Optional)</p>
        {imageUrl ? (
          <div className={styles.formPreview}>
            <p style={{ color: "green", fontSize: "0.9rem", padding: "10px" }}>✓ Image adjusted and uploaded</p>
            <img src={imageUrl} alt="Profile Preview" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
          </div>
        ) : (
          <CropUploadField
            label="Profile Image"
            onUploadComplete={(url) => setImageUrl(url)}
          />
        )}
      </div>

      <button type="submit" className={styles.btn} disabled={isPending}>
        {isPending ? "Saving..." : 'Add Member Securely'}
      </button>
    </form>
  )
}
