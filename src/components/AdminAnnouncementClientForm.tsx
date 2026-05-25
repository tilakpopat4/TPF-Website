'use client';

import { addAnnouncement, deleteAnnouncement, updateAnnouncement, reorderAnnouncement } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useTransition } from 'react';
import CropUploadField from './CropUploadField';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date | string;
  order: number;
}

export default function AdminAnnouncementClientForm({ initialAnnouncements = [] }: { initialAnnouncements: AnnouncementItem[] }) {
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [items, setItems] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Temporary state for the item being edited
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

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
      alert("Announcement posted successfully! Reloading...");
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
    if (confirm("Are you sure you want to delete this announcement?")) {
      startDelete(async () => {
        await deleteAnnouncement(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      });
    }
  };

  const startEditing = (ann: AnnouncementItem) => {
    setEditingId(ann.id);
    setEditTitle(ann.title);
    setEditContent(ann.content);
    setEditImageUrl(ann.imageUrl);
    setIsUploadingEditImage(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle || !editContent) {
      alert("Title and Content are required.");
      return;
    }

    setIsPending(true);
    try {
      const submitData = new FormData();
      submitData.append('title', editTitle);
      submitData.append('content', editContent);
      if (editImageUrl) submitData.append('imageUrl', editImageUrl);

      await updateAnnouncement(id, submitData);

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: editTitle,
                content: editContent,
                imageUrl: editImageUrl,
              }
            : item
        )
      );
      setEditingId(null);
      alert("Announcement updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update announcement.");
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
      await reorderAnnouncement(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialAnnouncements);
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
      await reorderAnnouncement(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialAnnouncements);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Create New Announcement</h3>
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

      {/* Existing Announcements List */}
      <div className={styles.list} style={{ marginTop: '2.5rem', maxHeight: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Existing Announcements & Sequence
        </h3>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No announcements added yet.
          </p>
        )}
        {items.map((ann, idx) => (
          <div key={ann.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                {ann.imageUrl && (
                  <img
                    src={ann.imageUrl}
                    alt={ann.title}
                    style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{ann.title}</strong>
                  <p className={styles.itemMeta} style={{ fontSize: '0.75rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                    {ann.content}
                  </p>
                </div>
              </div>

              <div className={styles.listItemActions}>
                <button
                  onClick={() => startEditing(ann)}
                  className={styles.editBtn}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ann.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting || isPending}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline Editing Form */}
            {editingId === ann.id && (
              <div className={styles.editForm}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Edit Announcement Details</h4>
                
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Announcement Title"
                  required
                  className={styles.input}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Content / Details"
                  required
                  className={styles.input}
                  style={{ minHeight: '80px' }}
                />

                {/* Image editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Image
                  </label>
                  {editImageUrl && !isUploadingEditImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={editImageUrl} alt="Current image" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditImage(true)}
                        className={styles.reorderBtn}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CropUploadField
                        label="New Image"
                        onUploadComplete={(url) => {
                          setEditImageUrl(url);
                          setIsUploadingEditImage(false);
                        }}
                      />
                      {ann.imageUrl && (
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
                    onClick={() => handleUpdate(ann.id)}
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
