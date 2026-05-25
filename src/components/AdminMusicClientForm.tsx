'use client';

import { addMusic, deleteMusic, updateMusic, reorderMusic } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useTransition } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import CropUploadField from './CropUploadField';

interface MusicTrack {
  id: string;
  title: string;
  audioUrl: string;
  posterUrl: string | null;
  createdAt: Date | string;
  order: number;
}

export default function AdminMusicClientForm({ initialMusic = [] }: { initialMusic: MusicTrack[] }) {
  const [isPending, setIsPending] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [items, setItems] = useState<MusicTrack[]>(initialMusic);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Temporary state for the item being edited
  const [editTitle, setEditTitle] = useState('');
  const [editAudioUrl, setEditAudioUrl] = useState<string | null>(null);
  const [editPosterUrl, setEditPosterUrl] = useState<string | null>(null);
  const [isUploadingEditAudio, setIsUploadingEditAudio] = useState(false);
  const [isUploadingEditPoster, setIsUploadingEditPoster] = useState(false);

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

      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('audioUrl', audioUrl);
      if (posterUrl) submitData.append('posterUrl', posterUrl);

      await addMusic(submitData);
      alert("Music track added successfully! Reloading...");
      window.location.reload();

      form.reset();
      setAudioUrl(null);
      setPosterUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please check console.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this track?")) {
      startDelete(async () => {
        await deleteMusic(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      });
    }
  };

  const startEditing = (track: MusicTrack) => {
    setEditingId(track.id);
    setEditTitle(track.title);
    setEditAudioUrl(track.audioUrl);
    setEditPosterUrl(track.posterUrl);
    setIsUploadingEditAudio(false);
    setIsUploadingEditPoster(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle) {
      alert("Title is required.");
      return;
    }
    if (!editAudioUrl) {
      alert("Audio file is required.");
      return;
    }

    setIsPending(true);
    try {
      const submitData = new FormData();
      submitData.append('title', editTitle);
      submitData.append('audioUrl', editAudioUrl);
      if (editPosterUrl) submitData.append('posterUrl', editPosterUrl);

      await updateMusic(id, submitData);

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: editTitle,
                audioUrl: editAudioUrl,
                posterUrl: editPosterUrl,
              }
            : item
        )
      );
      setEditingId(null);
      alert("Music track updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update music track.");
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
      await reorderMusic(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialMusic);
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
      await reorderMusic(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialMusic);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Add New Music Track</h3>
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
              <img src={posterUrl} alt="Poster Preview" style={{ width: "100%", height: "auto", maxHeight: "300px", borderRadius: "8px" }} />
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

      {/* Existing Music Tracks List */}
      <div className={styles.list} style={{ marginTop: '2.5rem', maxHeight: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Existing Tracks & Sequence
        </h3>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No music tracks added yet.
          </p>
        )}
        {items.map((m, idx) => (
          <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                {m.posterUrl && (
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{m.title}</strong>
                  <p className={styles.itemMeta} style={{ fontSize: '0.75rem' }}>
                    Audio URL: {m.audioUrl.substring(0, 40)}...
                  </p>
                </div>
              </div>

              <div className={styles.listItemActions}>
                <button
                  onClick={() => startEditing(m)}
                  className={styles.editBtn}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting || isPending}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline Editing Form */}
            {editingId === m.id && (
              <div className={styles.editForm}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Edit Music Track Details</h4>
                
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Music Title"
                  required
                  className={styles.input}
                />

                {/* Audio URL editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Audio File / Track
                  </label>
                  {editAudioUrl && !isUploadingEditAudio ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'green', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                        ✓ Audio File Set
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditAudio(true)}
                        className={styles.reorderBtn}
                        style={{ fontSize: '0.8rem' }}
                      >
                        Change Audio
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadDropzone
                        endpoint="audioUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            setEditAudioUrl(res[0].url);
                            setIsUploadingEditAudio(false);
                          }
                        }}
                        onUploadError={(error: Error) => alert(`Upload failed: ${error.message}`)}
                      />
                      {m.audioUrl && (
                        <button
                          type="button"
                          onClick={() => setIsUploadingEditAudio(false)}
                          className={styles.cancelEditBtn}
                          style={{ fontSize: '0.75rem', marginTop: '0.5rem', padding: '4px 8px' }}
                        >
                          Keep Existing
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Poster editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Poster Art
                  </label>
                  {editPosterUrl && !isUploadingEditPoster ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={editPosterUrl} alt="Current poster" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button
                        type="button"
                        onClick={() => setIsUploadingEditPoster(true)}
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
                          setEditPosterUrl(url);
                          setIsUploadingEditPoster(false);
                        }}
                      />
                      {m.posterUrl && (
                        <button
                          type="button"
                          onClick={() => setIsUploadingEditPoster(false)}
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
                    onClick={() => handleUpdate(m.id)}
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
