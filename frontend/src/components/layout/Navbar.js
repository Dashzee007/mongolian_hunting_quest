'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',        label: 'Нүүр' },
  { href: '/animals', label: 'Ан амьтад' },
  { href: '/gallery', label: 'Зургийн сан' },
  { href: '/map',     label: 'Ан агнуурын бүс' },
]

export default function Navbar() {
  const pathname = usePathname()

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
    </header>
  )
}
