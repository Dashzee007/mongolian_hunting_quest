'use client'

import { useState, useEffect } from 'react'
import animalsData from '@/data/animals.json'
import { fetchWikiImage } from '@/services/animals'

const FALLBACK = 'https://placehold.co/800x500/1b4332/52b788?text=No+Image'

export function useAnimals() {
  const [animals, setAnimals] = useState(() =>
    animalsData.map(a => ({ ...a, image: FALLBACK }))
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // Snapshot the initial plain animals list (no closures over state)
    const base = animalsData.slice()

    async function enrich() {
      const enriched = await Promise.all(
        base.map(async (animal) => {
          if (!animal.wikiTitle) return { ...animal, image: FALLBACK }
          const image = await fetchWikiImage(animal.wikiTitle)
          return { ...animal, image }
        })
      )
      if (!cancelled) {
        setAnimals(enriched)
        setLoading(false)
      }
    }

    enrich()
    return () => { cancelled = true }
  }, []) // runs once on mount

  return { animals, loading }
}
