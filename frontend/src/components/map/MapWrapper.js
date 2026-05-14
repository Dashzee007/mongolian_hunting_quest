'use client'

import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-soft)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
        <p>Газрын зураг ачааллаж байна…</p>
      </div>
    </div>
  ),
})

export default function MapWrapper() {
  return <MapClient />
}
