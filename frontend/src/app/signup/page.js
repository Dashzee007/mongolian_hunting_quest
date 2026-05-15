'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Бүртгэлд алдаа гарлаа')

      setSuccess('Бүртгэл амжилттай! Автоматаар нэвтэрч байна…')
      login(data.user, data.token)
      setTimeout(() => router.push('/'), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🦌</div>
        <h1 className="auth-title">Бүртгүүлэх</h1>
        <p className="auth-subtitle">Mongolian Hunting Quest-д нэгдэх</p>

        {error   && <div className="auth-message auth-error">{error}</div>}
        {success && <div className="auth-message auth-success">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Нэр</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Таны нэр"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Имэйл</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="имэйл@example.com"
              autoComplete="email"
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
              placeholder="Хамгийн багадаа 6 тэмдэгт"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Бүртгэж байна…' : 'Бүртгүүлэх'}
          </button>
        </form>

        <p className="auth-switch">
          Аккаунт байна уу? <Link href="/login">Нэвтрэх</Link>
        </p>
      </div>
    </main>
  )
}