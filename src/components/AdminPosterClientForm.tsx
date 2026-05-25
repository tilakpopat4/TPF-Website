'use client';

import { addPoster, deletePoster, updatePoster, reorderPoster } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useTransition } from 'react';
import CropUploadField from './CropUploadField';

interface PosterItem {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date | string;
  order: number;
}

export default function AdminPosterClientForm({ initialPosters = [] }: { initialPosters: PosterItem[] }) {
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [items, setItems] = useState<PosterItem[]>(initialPosters);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Temporary state for the item being edited
  const [editTitle, setEditTitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;

      if (!imageUrl) {
        alert("Please upload a poster image first.");
        setIsPending(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('imageUrl', imageUrl);

      await addPoster(submitData);
      alert("Poster added successfully! Reloading...");
      window.location.reload();

      form.reset();
      setImageUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this poster?")) {
      startDelete(async () => {
        await deletePoster(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      });
    }
  };

  const startEditing = (post: PosterItem) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditImageUrl(post.imageUrl);
    setIsUploadingEditImage(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle) {
      alert("Title is required.");
      return;
    }
    if (!editImageUrl) {
      alert("Poster image is required.");
      return;
    }

    setIsPending(true);
    try {
      const submitData = new FormData();
      submitData.append('title', editTitle);
      submitData.append('imageUrl', editImageUrl);

      await updatePoster(id, submitData);

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: editTitle,
                imageUrl: editImageUrl,
              }
            : item
        )
      );
      setEditingId(null);
      alert("Poster updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update poster.");
    } finally {
      setIsPending(false);
    }
  };

  // Reordering functions
  const moveUp = async (idx: number) => {
    if (idx === 0) return;
    const newItems = [...items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx - 1];
    newItems[idx - 1] = temp;

    setItems(newItems);
    try {
      await reorderPoster(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialPosters);
    }
  };

  const moveDown = async (idx: number) => {
    if (idx === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx + 1];
    newItems[idx + 1] = temp;

    setItems(newItems);
    try {
      await reorderPoster(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialPosters);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Add New Poster Work</h3>
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

      {/* Existing Posters List */}
      <div className={styles.list} style={{ marginTop: '2.5rem', maxHeight: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Existing Posters & Sequence
        </h3>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No posters added yet.
          </p>
        )}
        {items.map((post, idx) => (
          <div key={post.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className={styles.listItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                {/* Reorder Buttons */}
                <div className={styles.reorderControls}>
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0 || isPending}
                    className={styles.reorderBtn}
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1 || isPending}
                    className={styles.reorderBtn}
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{post.title}</strong>
                </div>
              </div>

              <div className={styles.listItemActions}>
                <button
                  onClick={() => startEditing(post)}
                  className={styles.editBtn}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting || isPending}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline Editing Form */}
            {editingId === post.id && (
              <div className={styles.editForm}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Edit Poster Details</h4>
                
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Poster Title"
                  required
                  className={styles.input}
                />

                {/* Poster image editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Poster Image
                  </label>
                  {editImageUrl && !isUploadingEditImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={editImageUrl} alt="Current poster" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditImage(true)}
                        className={styles.reorderBtn}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Change Poster
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CropUploadField
                        label="New Poster Image"
                        onUploadComplete={(url) => {
                          setEditImageUrl(url);
                          setIsUploadingEditImage(false);
                        }}
                      />
                      {post.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setIsUploadingEditImage(false)}
                          className={styles.cancelEditBtn}
                          style={{ fontSize: '0.75rem', marginTop: '0.5rem', padding: '4px 8px' }}
                        >
                          Keep Existing
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.editFormButtons}>
                  <button
                    onClick={() => handleUpdate(post.id)}
                    className={styles.saveBtn}
                    disabled={isPending}
                  >
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className={styles.cancelEditBtn}
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
