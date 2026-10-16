'use client';

import { useState } from 'react';
import { sendRecruitmentEmail } from '@/app/work-with-tpf/actions';
import styles from '@/app/work-with-tpf/page.module.css';

export default function RecruitmentForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await sendRecruitmentEmail(formData);
      if (result.success) {
        setMessage({ type: 'success', text: "Application sent successfully! We'll be in touch." });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: result.error || "Failed to send application. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "An error occurred. Please try again later." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required placeholder="Your Name" className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="your.email@example.com" className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Mobile No</label>
        <input type="tel" id="phone" name="phone" required placeholder="+91 ..." className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role">Role</label>
        <select id="role" name="role" required className={styles.select}>
          <option value="">Select Role</option>
          <option value="Editor">Editor</option>
          <option value="Designer">Designer</option>
          <option value="Motion Designer">Motion Designer</option>
          <option value="2D Artist">2D Artist</option>
          <option value="3D Artist">3D Artist</option>
          <option value="Asst. Director">Asst. Director</option>
          <option value="Actor/Actress">Actor/Actress</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
          <label htmlFor="portfolio">Portfolio Link (Google Drive / Behance / YouTube)</label>
          <input type="url" id="portfolio" name="portfolio" required placeholder="https://..." className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={4} placeholder="Tell us about yourself and why you'd like to work with TPF." className={styles.textarea}></textarea>
      </div>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          {message.text}
        </div>
      )}

      <button type="submit" className={styles.btn} disabled={isPending}>
        {isPending ? "Sending..." : "Submit Application"}
      </button>
    </form>
  )
}
