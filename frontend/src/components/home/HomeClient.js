'use client'

import { useState, useMemo } from 'react'
import { useAnimals } from '@/hooks/useAnimals'
import { filterAnimals } from '@/services/animals'
import SearchBar from '@/components/ui/SearchBar'
import AnimalCard from '@/components/animals/AnimalCard'
import AnimalModal from '@/components/animals/AnimalModal'
import FeaturesSection from '@/components/home/FeaturesSection'

function SkeletonGrid() {
  return (
    <div className="animal-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img skeleton-pulse" />
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-pulse" style={{ width: '60%' }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: '40%' }} />
            <div className="skeleton-line skeleton-pulse" style={{ width: '80%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomeClient() {
  const { animals, loading } = useAnimals()
  const [search, setSearch]           = useState('')
  const [type, setType]               = useState('all')
  const [selectedAnimal, setSelected] = useState(null)

  const filtered = useMemo(
    () => filterAnimals(animals, { search, type }),
    [animals, search, type]
  )

  const isSearchActive = search !== '' || type !== 'all'
  const headerText = isSearchActive
    ? `${filtered.length} амьтан олдлоо`
    : 'Бүх амьтдыг харуулж байна'

  return (
    <main>
      {/* ── HERO ── */}
      <section className="core">
        <div className="core-content">
          <h1>Монголын зэрлэг амьтдын нэгдсэн платформ</h1>
          <p>Монгол орны ан амьтад, агнуурын бүс болон зургийн санг нэг дороос харна уу</p>
          <SearchBar
            search={search}
            type={type}
            animals={animals}
            onSearchChange={setSearch}
            onTypeChange={setType}
          />
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section
        className={`results-section${isSearchActive ? ' search-active' : ''}`}
        aria-label="Хайлтын үр дүн"
      >
        <div className="results-header">{headerText}</div>

        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="animal-grid">
            <div className="no-results">Хайлтын үр дүн олдсонгүй</div>
          </div>
        ) : (
          <div className="animal-grid">
            {filtered.map((animal) => (
              <AnimalCard
                key={animal.name}
                animal={animal}
                onClick={setSelected}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <FeaturesSection />

      {/* ── MODAL ── */}
      {selectedAnimal && (
        <AnimalModal
          animal={selectedAnimal}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  )
}
