'use client';

import { addProject, deleteProject, updateProject, reorderProjects, fetchYouTubeInfo } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useRef, useTransition } from 'react';
import CropUploadField from './CropUploadField';

interface Project {
  id: string;
  title: string;
  description: string;
  bannerUrl: string | null;
  youtubeUrl: string | null;
  releaseDate: Date | string | null;
  order: number;
}

export default function AdminClientForm({ initialProjects = [] }: { initialProjects: Project[] }) {
  const [isPending, setIsPending] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [items, setItems] = useState<Project[]>(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Temporary state for the item being edited
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('');
  const [editReleaseDate, setEditReleaseDate] = useState('');
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  const [isUploadingEditBanner, setIsUploadingEditBanner] = useState(false);

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

      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('description', description);
      if (bannerUrl) submitData.append('bannerUrl', bannerUrl);
      
      const youtubeUrl = (form.elements.namedItem('youtubeUrl') as HTMLInputElement).value;
      const releaseDate = (form.elements.namedItem('releaseDate') as HTMLInputElement).value;
      
      if (youtubeUrl) submitData.append('youtubeUrl', youtubeUrl);
      if (releaseDate) submitData.append('releaseDate', releaseDate);

      await addProject(submitData);
      
      // Update local state by appending newly added project (fetch order again or assume end)
      // Since Server Action revalidates path, a full page update happens, but let's refresh local list
      alert("Project added successfully! Reloading...");
      window.location.reload();
      
      form.reset();
      setBannerUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please check console.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      startDelete(async () => {
        try {
          const res = await deleteProject(id);
          if (res && !res.success) {
            alert("Failed to delete project: " + res.error);
          } else {
            setItems((prev) => prev.filter((item) => item.id !== id));
          }
        } catch (err: any) {
          console.error("Client delete error:", err);
          alert("Failed to delete project: " + (err.message || String(err)));
        }
      });
    }
  };

  const startEditing = (p: Project) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditDescription(p.description);
    setEditYoutubeUrl(p.youtubeUrl || '');
    setEditReleaseDate(p.releaseDate ? new Date(p.releaseDate).toISOString().split('T')[0] : '');
    setEditBannerUrl(p.bannerUrl);
    setIsUploadingEditBanner(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle || !editDescription) {
      alert("Title and Description are required.");
      return;
    }

    setIsPending(true);
    try {
      const submitData = new FormData();
      submitData.append('title', editTitle);
      submitData.append('description', editDescription);
      if (editYoutubeUrl) submitData.append('youtubeUrl', editYoutubeUrl);
      if (editReleaseDate) submitData.append('releaseDate', editReleaseDate);
      if (editBannerUrl) submitData.append('bannerUrl', editBannerUrl);

      const res = await updateProject(id, submitData);
      
      if (res && !res.success) {
        alert("Failed to update project: " + res.error);
      } else {
        // Update local state
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: editTitle,
                  description: editDescription,
                  youtubeUrl: editYoutubeUrl || null,
                  releaseDate: editReleaseDate || null,
                  bannerUrl: editBannerUrl,
                }
              : item
          )
        );
        setEditingId(null);
        alert("Project updated successfully!");
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to update project: " + (err.message || String(err)));
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
      await reorderProjects(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(items);
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
      await reorderProjects(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(items);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Create New Project</h3>
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

      {/* Projects List with Edit and Reorder controls */}
      <div className={styles.list} style={{ marginTop: '2rem', maxHeight: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Existing Projects & Sequence
        </h3>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No projects added yet.
          </p>
        )}
        {items.map((p, idx) => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                {p.bannerUrl && (
                  <img
                    src={p.bannerUrl}
                    alt={p.title}
                    style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: '0.95rem', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {p.title}
                  </strong>
                  <p className={styles.itemMeta} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {p.description}
                  </p>
                </div>
              </div>

              <div className={styles.listItemActions}>
                <button
                  onClick={() => startEditing(p)}
                  className={styles.editBtn}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting || isPending}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline Editing Form */}
            {editingId === p.id && (
              <div className={styles.editForm}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Edit Project Details</h4>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Project Title"
                  required
                  className={styles.input}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  required
                  className={styles.input}
                  style={{ minHeight: '80px' }}
                />
                <input
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  placeholder="YouTube URL"
                  className={styles.input}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Release Date</label>
                  <input
                    type="date"
                    value={editReleaseDate}
                    onChange={(e) => setEditReleaseDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Banner Image
                  </label>
                  {editBannerUrl && !isUploadingEditBanner ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={editBannerUrl} alt="Current banner" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditBanner(true)}
                        className={styles.reorderBtn}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Change Banner
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CropUploadField
                        label="New Banner Image"
                        onUploadComplete={(url) => {
                          setEditBannerUrl(url);
                          setIsUploadingEditBanner(false);
                        }}
                      />
                      {p.bannerUrl && (
                        <button
                          type="button"
                          onClick={() => setIsUploadingEditBanner(false)}
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
                    onClick={() => handleUpdate(p.id)}
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
