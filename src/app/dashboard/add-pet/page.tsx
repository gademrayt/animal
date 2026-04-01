import { addPet } from './actions'
import styles from '@/app/login/page.module.css' 

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AddPetPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedParams = await searchParams;
  const error = typeof resolvedParams?.error === 'string' ? resolvedParams.error : null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className={styles.title} style={{ textAlign: 'left', marginBottom: '2rem' }}>Add New Pet</h1>
      
      <form action={addPet} className={styles.formContainer} style={{ maxWidth: '100%' }}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Pet Name *</label>
          <input required id="name" name="name" type="text" className={styles.input} placeholder="e.g. Max" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="species" className={styles.label}>Species *</label>
          <select required id="species" name="species" className={styles.input} defaultValue="">
            <option value="" disabled>Select species</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="breed" className={styles.label}>Breed</label>
          <input id="breed" name="breed" type="text" className={styles.input} placeholder="e.g. Golden Retriever" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="birth_date" className={styles.label}>Birth Date</label>
          <input id="birth_date" name="birth_date" type="date" className={styles.input} />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>Save Pet Profile</button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  )
}
