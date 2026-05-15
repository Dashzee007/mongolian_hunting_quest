'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

const NAV_LINKS = [
  { href: '/',        label: 'Нүүр' },
  { href: '/animals', label: 'Ан амьтад' },
  { href: '/gallery', label: 'Зургийн сан' },
  { href: '/map',     label: 'Ан агнуурын бүс' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="navbar">
      <div className="logo">Mongolian Hunting Quest</div>
      <nav>
        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? 'nav-active' : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="navbar-auth">
        {user ? (
          <div className="user-menu">
            <span className="user-name">{user.username || user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Гарах</button>
          </div>
        ) : (
          <div className="auth-links">
            <Link href="/login" className="nav-link">Нэвтрэх</Link>
            <Link href="/signup" className="nav-link">Бүртгүүлэх</Link>
          </div>
        )}
      </div>
    </header>
  )
}