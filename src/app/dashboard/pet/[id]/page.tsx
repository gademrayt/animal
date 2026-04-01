import { createClient } from '@/utils/supabase/server'
import styles from './page.module.css'
import formStyles from '@/app/login/page.module.css'
import { addMetric } from './actions'
import HealthChart from './HealthChart'
import Link from 'next/link'

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function PetPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const searchParamsResolved = await searchParams;
  const error = typeof searchParamsResolved?.error === 'string' ? searchParamsResolved.error : null;

  const supabase = await createClient()

  let pet = null;
  let metrics: any[] = [];
  try {
    const { data: petData } = await supabase.from('pets').select('*').eq('id', id).single()
    pet = petData;

    const { data: metricsData } = await supabase.from('health_metrics').select('*').eq('pet_id', id).order('date', { ascending: false })
    if (metricsData) metrics = metricsData;
  } catch (err) {}

  if (!pet) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pet not found!</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Make sure you have connected Supabase and run the SQL schema.</p>
        <Link href="/dashboard" className={`${formStyles.button} ${formStyles.primaryButton}`}>Return to Dashboard</Link>
      </div>
    )
  }

  const age = pet.birth_date ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear() : 'Unknown'

  return (
    <div className={styles.gridLayout}>
      <div className={styles.panel}>
        <h1 className={styles.title}>{pet.name}</h1>
        <p className={styles.subtitle}>{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Age</div>
            <div className={styles.infoValue}>{age} {age !== 'Unknown' && 'years'}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Records</div>
            <div className={styles.infoValue}>{metrics.length}</div>
          </div>
          {metrics.length > 0 && metrics[0].weight && (
             <div className={styles.infoCard}>
               <div className={styles.infoLabel}>Latest Weight</div>
               <div className={styles.infoValue}>{metrics[0].weight} kg</div>
             </div>
          )}
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Weight History</h3>
        <HealthChart metrics={metrics} />

        <h3 style={{ marginTop: '3rem', fontSize: '1.5rem', fontWeight: 700 }}>Recent Records</h3>
        <div className={styles.historyList}>
          {metrics.length === 0 ? (
            <p style={{ opacity: 0.6, marginTop: '1rem' }}>No metrics recorded yet.</p>
          ) : (
            metrics.slice(0, 5).map(m => (
              <div key={m.id} className={styles.historyItem}>
                <div className={styles.historyDate}>{new Date(m.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className={styles.metricGrid}>
                  <div><strong>Weight:</strong> {m.weight ? `${m.weight} kg` : '-'}</div>
                  <div><strong>Activity:</strong> {m.activity_level ? `${m.activity_level}/5` : '-'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Diet:</strong> {m.diet || '-'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Notes:</strong> {m.notes || '-'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={styles.panel}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Record</h2>
        <form action={addMetric} className={formStyles.formContainer} style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
          <input type="hidden" name="pet_id" value={pet.id} />
          
          <div className={formStyles.inputGroup}>
            <label htmlFor="date" className={formStyles.label}>Date *</label>
            <input required id="date" name="date" type="date" className={formStyles.input} defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="weight" className={formStyles.label}>Weight (kg)</label>
            <input id="weight" name="weight" type="number" step="0.1" className={formStyles.input} placeholder="e.g. 12.5" />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="activity_level" className={formStyles.label}>Activity Level (1-5)</label>
            <select id="activity_level" name="activity_level" className={formStyles.input} defaultValue="">
              <option value="" disabled>Select level</option>
              <option value="1">1 - Very Low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Normal</option>
              <option value="4">4 - High</option>
              <option value="5">5 - Very High</option>
            </select>
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="diet" className={formStyles.label}>Diet Notes</label>
            <input id="diet" name="diet" type="text" className={formStyles.input} placeholder="e.g. Dry food + vitamins" />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="notes" className={formStyles.label}>General Notes</label>
            <textarea id="notes" name="notes" className={formStyles.input} placeholder="Any observations?" rows={4} style={{ resize: 'vertical' }}></textarea>
          </div>

          <div className={formStyles.buttonGroup}>
            <button type="submit" className={`${formStyles.button} ${formStyles.primaryButton}`}>Save Record</button>
          </div>

          {error && <p className={formStyles.errorMessage} style={{ padding: '0.8rem', marginTop: '1rem' }}>{error}</p>}
        </form>
      </div>
    </div>
  )
}
