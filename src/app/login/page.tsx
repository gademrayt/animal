import styles from './page.module.css'
import { login, signup } from './actions'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedParams = await searchParams;
  const message = typeof resolvedParams?.message === 'string' ? resolvedParams.message : null;

  return (
    <div className={styles.container}>
      <form className={styles.formContainer}>
        <h1 className={styles.title}>Welcome Back</h1>
        
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className={styles.input} 
            placeholder="you@example.com"
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button formAction={login} className={`${styles.button} ${styles.primaryButton}`}>Sign In</button>
          <button formAction={signup} className={`${styles.button} ${styles.secondaryButton}`}>Sign Up</button>
        </div>

        {message && (
          <div className={styles.errorMessage}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
