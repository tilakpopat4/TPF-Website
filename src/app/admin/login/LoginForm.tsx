'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/app/admin/actions';
import styles from './page.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginAdminAction(formData);
      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.cardHeader}>
        <span className={styles.badge}>🔒 Secure Management Console</span>
        <h1 className={styles.title}>TPF Admin Login</h1>
        <p className={styles.subtitle}>
          Sign in to access productions, cast rosters, media channels, and website sequences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.alertError}>{error}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder="Admin username"
            className={styles.input}
            disabled={isPending}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className={styles.input}
            disabled={isPending}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isPending}>
          {isPending ? 'Verifying...' : 'Authenticate & Enter'}
        </button>
      </form>

      <div className={styles.cardFooter}>
        <span>Protected by encrypted HMAC session tokens</span>
      </div>
    </div>
  );
}
