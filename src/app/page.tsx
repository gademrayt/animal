import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Pet Health Dashboard</h1>
        <p className={styles.subtitle}>
          Track your furry friends' health, activity, and diet metrics beautifully and easily.
        </p>
        
        <div className={styles.buttonGroup}>
          <Link href="/login" className={`${styles.button} ${styles.primaryButton}`}>
            Get Started
          </Link>
          <Link href="/dashboard" className={`${styles.button} ${styles.secondaryButton}`}>
            View Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
