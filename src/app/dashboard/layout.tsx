import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { LogOut, Home, PlusCircle } from 'lucide-react'
import styles from './layout.module.css'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Pet Health</div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>
            <Home size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/add-pet" className={styles.navItem}>
            <PlusCircle size={20} /> Add Pet
          </Link>
        </nav>
        <div className={styles.footer}>
          <form action={async () => {
            'use server'
            const s = await createClient()
            await s.auth.signOut()
            redirect('/login')
          }}>
            <button type="submit" className={styles.logoutButton}>
              <LogOut size={20} /> Sign Out
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Welcome, {user.email?.split('@')[0]}</h2>
        </header>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  )
}
