'use client'

import { useState, useMemo } from 'react'
import { useAnimals } from '@/hooks/useAnimals'

const FALLBACK = 'https://placehold.co/800x500/1b4332/52b788?text=No+Image'

const TABS = [
  { value: 'all',           label: '🌿 Бүгд' },
  { value: 'Хөхтөн',        label: '🦌 Хөхтөн' },
  { value: 'Шувуу',          label: '🦅 Шувуу' },
  { value: 'Холимог идэшт',  label: '🐻 Холимог идэшт' },
]

export default function GalleryPage() {
  const { animals, loading } = useAnimals()
  const [activeTab, setActiveTab]   = useState('all')
  const [lightbox, setLightbox]     = useState(null) // { animal, index }

  const filtered = useMemo(
    () => activeTab === 'all' ? animals : animals.filter(a => a.type === activeTab),
    [animals, activeTab]
  )

  function openLightbox(animal, index) {
    setLightbox({ animal, index })
  }

  function closeLightbox() {
    setLightbox(null)
  }

  function prev() {
    setLightbox(lb => ({
      ...lb,
      index: (lb.index - 1 + filtered.length) % filtered.length,
      animal: filtered[(lb.index - 1 + filtered.length) % filtered.length],
    }))
  }

  function next() {
    setLightbox(lb => ({
      ...lb,
      index: (lb.index + 1) % filtered.length,
      animal: filtered[(lb.index + 1) % filtered.length],
    }))
  }

  return (
    <main>
      {/* ── HERO ── */}
      <section className="page-hero gallery-hero">
        <div className="page-hero-content">
          <h1>Зургийн сан</h1>
          <p>Монголын зэрлэг амьтдын гэрэл зургийн цуглуулга</p>
        </div>
      </section>

      {/* ── TABS ── */}
      <section className="gallery-tabs" aria-label="Ангилал шүүлт">
        <div className="tabs-inner">
          {TABS.map(tab => (
            <button
              key={tab.value}
              className={`tab-btn${activeTab === tab.value ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── GALLERY GRID ── */}
      <section className="gallery-section">
        <div className="gallery-grid">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="gallery-item skeleton-pulse" />
              ))
            : filtered.map((animal, i) => (
                <div
                  key={animal.name}
                  className="gallery-item"
                  onClick={() => openLightbox(animal, i)}
                >
                  <img
                    src={animal.image || FALLBACK}
                    alt={animal.name}
                    loading="lazy"
                    onError={e => { e.target.src = FALLBACK }}
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-name">{animal.name}</div>
                    <div className="gallery-type">{animal.type} · {animal.region}</div>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="lb-close" onClick={closeLightbox} aria-label="Хаах">✕</button>
          <button className="lb-nav lb-prev" onClick={prev} aria-label="Өмнөх">‹</button>
          <button className="lb-nav lb-next" onClick={next} aria-label="Дараах">›</button>
          <div className="lb-content">
            <img
              src={lightbox.animal.image || FALLBACK}
              alt={lightbox.animal.name}
              onError={e => { e.target.src = FALLBACK }}
            />
            <div className="lb-caption">
              <h3>{lightbox.animal.name}</h3>
              <p>{lightbox.animal.type} · {lightbox.animal.region}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
