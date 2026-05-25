'use client';

import { addCastCrew, deleteCastCrew, updateCastCrew, reorderCastCrew } from '@/app/admin/actions';
import styles from '@/app/admin/page.module.css';
import { useState, useTransition } from 'react';
import CropUploadField from './CropUploadField';

interface CastCrewMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  createdAt: Date | string;
  order: number;
}

export default function AdminCastCrewClientForm({ initialCrew = [] }: { initialCrew: CastCrewMember[] }) {
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [items, setItems] = useState<CastCrewMember[]>(initialCrew);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Temporary state for the item being edited
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const form = e.currentTarget;
    
    try {
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const role = (form.elements.namedItem('role') as HTMLInputElement).value;

      const submitData = new FormData();
      submitData.append('name', name);
      submitData.append('role', role);
      if (imageUrl) submitData.append('imageUrl', imageUrl);

      await addCastCrew(submitData);
      alert("Member added successfully! Reloading...");
      window.location.reload();

      form.reset();
      setImageUrl(null);
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission. Please check console.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this crew member?")) {
      startDelete(async () => {
        await deleteCastCrew(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      });
    }
  };

  const startEditing = (member: CastCrewMember) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
    setEditImageUrl(member.imageUrl);
    setIsUploadingEditImage(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName || !editRole) {
      alert("Name and Role are required.");
      return;
    }

    setIsPending(true);
    try {
      const submitData = new FormData();
      submitData.append('name', editName);
      submitData.append('role', editRole);
      if (editImageUrl) submitData.append('imageUrl', editImageUrl);

      await updateCastCrew(id, submitData);

      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: editName,
                role: editRole,
                imageUrl: editImageUrl,
              }
            : item
        )
      );
      setEditingId(null);
      alert("Member details updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update member.");
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
      await reorderCastCrew(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialCrew);
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
      await reorderCastCrew(newItems.map((item) => item.id));
    } catch (error) {
      console.error(error);
      alert("Failed to save reorder. Reverting...");
      setItems(initialCrew);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>Add New Cast & Crew Member</h3>
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

      {/* Existing Cast & Crew List */}
      <div className={styles.list} style={{ marginTop: '2.5rem', maxHeight: '500px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Existing Members & Sequence
        </h3>
        {items.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            No members added yet.
          </p>
        )}
        {items.map((c, idx) => (
          <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                  />
                )}
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>{c.name}</strong>
                  <p className={styles.itemMeta} style={{ fontSize: '0.75rem' }}>
                    {c.role}
                  </p>
                </div>
              </div>

              <div className={styles.listItemActions}>
                <button
                  onClick={() => startEditing(c)}
                  className={styles.editBtn}
                  disabled={isPending}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className={styles.deleteBtn}
                  disabled={isDeleting || isPending}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline Editing Form */}
            {editingId === c.id && (
              <div className={styles.editForm}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Edit Member Details</h4>
                
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                  required
                  className={styles.input}
                />
                <input
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="Role"
                  required
                  className={styles.input}
                />

                {/* Profile image editing */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Profile Photo
                  </label>
                  {editImageUrl && !isUploadingEditImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={editImageUrl} alt="Current photo" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
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
                        label="New Profile Image"
                        onUploadComplete={(url) => {
                          setEditImageUrl(url);
                          setIsUploadingEditImage(false);
                        }}
                      />
                      {c.imageUrl && (
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
                    onClick={() => handleUpdate(c.id)}
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
