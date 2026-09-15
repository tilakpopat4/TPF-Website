import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import LoginForm from './LoginForm';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Authentication | Tilak Popat Films',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <main className={styles.loginPage}>
      <LoginForm />
    </main>
  );
}
