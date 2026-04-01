import styles from "./page.module.css";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient();
  let session = null;
  try {
    const { data: { session: s } } = await supabase.auth.getSession();
    session = s;
  } catch(e) {}

  return (
    <main style={{ width: '100%', overflowX: 'hidden' }}>
      <nav className={styles.navbar}>
        <div className={styles.brand}>PetHealth</div>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="#features" className={styles.navLink}>Features</Link>
          {session ? (
            <Link href="/dashboard" className={styles.navButton}>Enter App</Link>
          ) : (
            <Link href="/login" className={styles.navButton}>Sign In</Link>
          )}
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Healthy Pets, Happy Life</h1>
          <p className={styles.heroSubtitle}>Your all-in-one companion for tracking furry and feathered friends.</p>
        </div>
      </section>

      <section id="features" className={styles.featuresWrapper}>
        <div className={styles.featuresGrid}>
          
          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Track Vitals</h2>
            <p className={styles.featureText}>
              Consistent monitoring of your pet's weight and activity is crucial. We provide beautiful charts, logs, and historical data so you can catch health issues early and keep your pets in their optimal shape.
            </p>
            <Link href="/login" className={styles.readMoreBtn}>Read more</Link>
          </div>

          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Activity Logs</h2>
            <p className={styles.featureText}>
              Notice a sudden drop in energy? Activity tracking helps you pinpoint behavioral changes. Rate their daily energy levels on a sliding scale to keep a precise diary for your next vet visit.
            </p>
            <Link href="/login" className={styles.readMoreBtn}>Read more</Link>
          </div>

          <div className={styles.featureCard}>
            <h2 className={styles.featureTitle}>Dietary Needs</h2>
            <p className={styles.featureText}>
              What you feed them matters! Keep track of different food brands, portions, and vitamin intakes. Never forget a dietary restriction again with detailed notes attached to each daily record.
            </p>
            <Link href="/login" className={styles.readMoreBtn}>Read more</Link>
          </div>

        </div>
      </section>
    </main>
  );
}
