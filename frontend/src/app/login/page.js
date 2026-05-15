'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Нэвтрэхэд алдаа гарлаа')

      login(data.user, data.token)
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🦁</div>
        <h1 className="auth-title">Нэвтрэх</h1>
        <p className="auth-subtitle">Mongolian Hunting Quest-д тавтай морил</p>

        {error && (
          <div className="auth-message auth-error">{error}</div>
        )}

        <div className="seed-users">
          <p className="seed-title">📝 Өргөдлийн хэрэглэгчид (Test1234!):</p>
          <ul>
            <li>bold@example.mn</li>
            <li>undral@example.mn</li>
            <li>ganbayar@example.mn</li>
            <li>oyun@example.mn</li>
            <li>temujin@example.mn</li>
            <li>james@example.com</li>
          </ul>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="identifier">Имэйл эсвэл нэвтрэх нэр</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="bold@example.mn"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Нууц үг</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Нууц үгээ оруулна уу"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Нэвтэрч байна…' : 'Нэвтрэх'}
          </button>
        </form>

        <p className="auth-switch">
          Бүртгэлгүй юу? <Link href="/signup">Бүртгүүлэх</Link>
        </p>
      </div>
    </main>
  )
}