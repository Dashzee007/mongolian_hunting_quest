'use client'

import { useState, useMemo } from 'react'
import { useAnimals } from '@/hooks/useAnimals'
import { filterAnimals, getRegions } from '@/services/animals'
import AnimalCard from '@/components/animals/AnimalCard'
import AnimalModal from '@/components/animals/AnimalModal'

export default function AnimalsPage() {
  const { animals, loading } = useAnimals()
  const [search, setSearch]           = useState('')
  const [type, setType]               = useState('all')
  const [region, setRegion]           = useState('all')
  const [selectedAnimal, setSelected] = useState(null)

  const regions  = useMemo(() => getRegions(animals), [animals])
  const filtered = useMemo(
    () => filterAnimals(animals, { search, type, region }),
    [animals, search, type, region]
  )

  return (
    <main>
      {/* ── HERO ── */}
      <section className="page-hero animals-hero">
        <div className="page-hero-content">
          <h1>Ан амьтдын мэдээллийн сан</h1>
          <p>Монгол орны зэрлэг амьтдын дэлгэрэнгүй мэдээлэл, байршил, ангилал</p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="filter-bar" aria-label="Шүүлт">
        <div className="filter-inner">
          <div className="filter-group">
            <label htmlFor="a-search">Хайх</label>
            <input
              id="a-search"
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Амьтны нэр…"
              autoComplete="off"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="a-type">Төрөл</label>
            <select id="a-type" value={type} onChange={e => setType(e.target.value)}>
              <option value="all">Бүгд</option>
              <option value="Хөхтөн">🦌 Хөхтөн</option>
              <option value="Шувуу">🦅 Шувуу</option>
              <option value="Холимог идэшт">🐻 Холимог идэшт</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="a-region">Бүс нутаг</label>
            <select id="a-region" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="all">Бүгд</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="filter-stats">
            {loading ? 'Уншиж байна…' : `${filtered.length} амьтан`}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="animals-section">
        {loading ? (
          <div className="animal-grid animals-page-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img skeleton-pulse" />
                <div className="skeleton-body">
                  <div className="skeleton-line skeleton-pulse" style={{ width: '60%' }} />
                  <div className="skeleton-line skeleton-pulse" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="animal-grid animals-page-grid">
            <div className="no-results">Хайлтын үр дүн олдсонгүй</div>
          </div>
        ) : (
          <div className="animal-grid animals-page-grid">
            {filtered.map(animal => (
              <AnimalCard key={animal.name} animal={animal} onClick={setSelected} />
            ))}
          </div>
        )}
      </section>

      {selectedAnimal && (
        <AnimalModal animal={selectedAnimal} onClose={() => setSelected(null)} />
      )}
    </main>
  )
}
