'use client'

const TYPE_BADGE = {
  'Хөхтөн':       'badge-mammal',
  'Шувуу':         'badge-bird',
  'Холимог идэшт': 'badge-mixed',
}

const FALLBACK = 'https://placehold.co/800x500/1b4332/52b788?text=No+Image'

export default function AnimalCard({ animal, onClick }) {
  const badgeClass = TYPE_BADGE[animal.type] || 'badge-mammal'

  return (
    <article className="animal-card" onClick={() => onClick?.(animal)}>
      <div className="animal-card-img-wrap">
        <img
          src={animal.image || FALLBACK}
          alt={animal.name}
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK }}
        />
        <span className={`animal-type-badge ${badgeClass}`}>{animal.type}</span>
      </div>

      <div className="card-body">
        <h3>{animal.name}</h3>
        <div className="card-meta">
          <span className="card-region">{animal.region}</span>
        </div>
        <p className="card-desc">{animal.description}</p>
        <div className="card-footer">
          <span className="card-link">Дэлгэрэнгүй</span>
        </div>
      </div>
    </article>
  )
}
