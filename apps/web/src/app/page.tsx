import { redirect } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  redirect('/auth/login') // Redirect otomatis saat halaman dibuka

  return (
    <main className={styles.main}>
    </main>
  )
}
