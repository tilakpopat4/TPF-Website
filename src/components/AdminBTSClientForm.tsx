'use client';

import { addBTS, deleteBTS, updateBTS, reorderBTS } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useTransition } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

interface BTSItem {
  id: string;
  title: string;
  videoUrl: string | null;
  thumbnail: string | null;
  createdAt: Date | string;
  order: number;
}

export default function AdminBTSClientForm({ btsItems }: { btsItems: BTSItem[] }) {
  const [isPending, setIsPending] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [items, setItems] = useState<BTSItem[]>(btsItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Temporary state for the item being edited
  const [editTitle, setEditTitle] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState<string | null>(null);
  const [editThumbnail, setEditThumbnail] = useState<string | null>(null);
  const [isUploadingEditThumb, setIsUploadingEditThumb] = useState(false);
  const [isUploadingEditVideo, setIsUploadingEditVideo] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;

    try {
      const title = (form.elements.namedItem('title') as HTMLInputElement).value;
      if (!title) { alert('Please enter a title.'); return; }

      const submitData = new FormData();
      submitData.append('title', title);
      if (videoUrl) submitData.append('videoUrl', videoUrl);
      if (thumbnail) submitData.append('thumbnail', thumbnail);

      await addBTS(submitData);
      alert('BTS content added! Reloading...');
      window.location.reload();

      form.reset();
      setVideoUrl(null);
      setThumbnail(null);
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this Behind The Scenes item?')) {
      startDelete(async () => {
        await deleteBTS(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      });
    }
  };

  const startEditing = (item: BTSItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditVideoUrl(item.videoUrl || '');
    setEditThumbnail(item.thumbnail || '');
    setIsUploadingEditThumb(false);
    setIsUploadingEditVideo(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle) {
      alert("Title is required.");
      return;
    }

    setIsPending(true);
    try {
      const submitData = new FormData();
      submitData.append('title', editTitle);
      if (editVideoUrl) submitData.append('videoUrl', editVideoUrl);
      if (editThumbnail) submitData.append('thumbnail', editThumbnail);

      await updateBTS(id, submitData);

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: editTitle,
                videoUrl: editVideoUrl || null,
                thumbnail: editThumbnail || null,
              }
            : item
        )
      );
      setEditingId(null);
      alert("BTS item updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update BTS item.");
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
      await reorderBTS(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(btsItems);
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
      await reorderBTS(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(btsItems);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Create New BTS</h3>
        <input name="title" placeholder="BTS Title" required className={styles.input} />

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            YouTube URL (paste link here)
          </p>
          <input
            name="videoUrlInput"
            placeholder="https://youtube.com/watch?v=..."
            className={styles.input}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (val && (val.includes('youtube') || val.includes('youtu.be'))) {
                setVideoUrl(val);
                if (!thumbnail) {
                  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                  const match = val.match(regExp);
                  const videoId = match && match[2].length === 11 ? match[2] : null;
                  if (videoId) setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                }
              } else {
                setVideoUrl(null);
              }
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            OR upload a video file
          </p>
          {videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be') ? (
            <p style={{ color: 'green', fontSize: '0.8rem' }}>✓ Video uploaded</p>
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

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Thumbnail (Optional)
          </p>
          {thumbnail ? (
            <div className={styles.formPreview}>
              <img src={thumbnail} alt="BTS Thumbnail" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            </div>
          ) : (
            <CropUploadField label="BTS Thumbnail" onUploadComplete={(url) => setThumbnail(url)} />
          )}
        </div>

        <button type="submit" className={styles.btn} disabled={isPending}>
          {isPending ? 'Adding...' : 'Add BTS Securely'}
        </button>
      </form>

      {/* Existing BTS List */}
      <div className={styles.list} style={{ marginTop: '2.5rem', maxHeight: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Existing BTS Content & Sequence
        </h3>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No BTS content yet.
          </p>
        )}
        {items.map((item, idx) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: '55px', height: '38px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{item.title}</strong>
                  <p className={styles.itemMeta}>{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className={styles.listItemActions}>
                <button
                  onClick={() => startEditing(item)}
                  className={styles.editBtn}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting || isPending}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline Editing Form */}
            {editingId === item.id && (
              <div className={styles.editForm}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Edit Behind The Scenes Details</h4>
                
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="BTS Title"
                  required
                  className={styles.input}
                />

                {/* Video URL editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Video URL / Link
                  </label>
                  {editVideoUrl && !isUploadingEditVideo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'green', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                        ✓ {editVideoUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditVideo(true)}
                        className={styles.reorderBtn}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Change Video
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input
                        value={editVideoUrl || ''}
                        onChange={(e) => setEditVideoUrl(e.target.value)}
                        placeholder="YouTube Link (https://youtube.com/...)"
                        className={styles.input}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0' }}>Or upload file:</p>
                      <UploadDropzone
                        endpoint="videoUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            setEditVideoUrl(res[0].url);
                            setIsUploadingEditVideo(false);
                          }
                        }}
                        onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
                      />
                      {item.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setIsUploadingEditVideo(false)}
                          className={styles.cancelEditBtn}
                          style={{ fontSize: '0.75rem', alignSelf: 'flex-start', padding: '4px 8px' }}
                        >
                          Keep Existing
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Thumbnail editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Thumbnail Image
                  </label>
                  {editThumbnail && !isUploadingEditThumb ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={editThumbnail} alt="Current thumbnail" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditThumb(true)}
                        className={styles.reorderBtn}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Change Thumbnail
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CropUploadField
                        label="New Thumbnail"
                        onUploadComplete={(url) => {
                          setEditThumbnail(url);
                          setIsUploadingEditThumb(false);
                        }}
                      />
                      {item.thumbnail && (
                        <button
                          type="button"
                          onClick={() => setIsUploadingEditThumb(false)}
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
                    onClick={() => handleUpdate(item.id)}
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
