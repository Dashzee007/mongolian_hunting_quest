'use client'

import { useEffect } from 'react'

const FALLBACK = 'https://placehold.co/800x500/1b4332/52b788?text=No+Image'

const TYPE_LABEL = {
  'Хөхтөн':       '🦌 Хөхтөн',
  'Шувуу':         '🦅 Шувуу',
  'Холимог идэшт': '🐻 Холимог идэшт',
}

export default function AnimalModal({ animal, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!animal) return null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Хаах">✕</button>

        <img
          src={animal.image || FALLBACK}
          alt={animal.name}
          onError={(e) => { e.target.src = FALLBACK }}
        />

        <div className="modal-body">
          <h2>{animal.name}</h2>
          <p className="modal-meta">
            📍 {animal.region} &nbsp;·&nbsp; {TYPE_LABEL[animal.type] || animal.type}
          </p>
          <p>{animal.description}</p>
          {animal.wikiTitle && (
            <div className="modal-tags">
              <a
                href={`https://en.wikipedia.org/wiki/${animal.wikiTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: 'var(--g600)', fontWeight: 600 }}
              >
                Wikipedia →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
