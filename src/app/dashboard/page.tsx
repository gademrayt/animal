import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import styles from './page.module.css'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Gracefully handle if DB is not connected yet
  let pets: any[] | null = null;
  let dbError = false;

  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) dbError = true;
    else pets = data;
  } catch (err) {
    dbError = true;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Your Pets</h1>
        {pets && pets.length > 0 && (
          <Link href="/dashboard/add-pet" className={styles.viewButton} style={{ marginTop: 0, padding: '0.8rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none' }}>
            + Add New Pet
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {dbError ? (
          <div className={styles.emptyState}>
            <h3>Cannot connect to Database</h3>
            <p>Please make sure you have created the Supabase project, executed the SQL script, and added correct keys to .env.local</p>
          </div>
        ) : pets?.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No pets found</h3>
            <p>You haven't added any pets yet. Let's get started!</p>
            <Link href="/dashboard/add-pet">Add Your First Pet</Link>
          </div>
        ) : (
          pets?.map((pet) => (
            <div key={pet.id} className={styles.petCard}>
              <div className={styles.petHeader}>
                <h3 className={styles.petName}>{pet.name}</h3>
                <span className={styles.petSpecies}>{pet.species}</span>
              </div>
              <div className={styles.petDetails}>
                <p><strong>Breed:</strong> {pet.breed || 'Unknown'}</p>
                <p><strong>Age:</strong> {pet.birth_date ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear() + ' years' : 'Unknown'}</p>
              </div>
              <Link href={`/dashboard/pet/${pet.id}`} className={styles.viewButton}>
                View Health Metrics
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
