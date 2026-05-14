import animalsData from '@/data/animals.json'

const FALLBACK_IMAGE = 'https://placehold.co/800x500/1b4332/52b788?text=No+Image'

export async function fetchWikiImage(wikiTitle) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
    )
    if (!res.ok) return FALLBACK_IMAGE
    const data = await res.json()
    return data.thumbnail?.source ?? FALLBACK_IMAGE
  } catch {
    return FALLBACK_IMAGE
  }
}

// Returns animals immediately with placeholder images (no waiting)
export function getAnimalsSync() {
  return animalsData.map(animal => ({ ...animal, image: FALLBACK_IMAGE }))
}

// Returns all animals with Wikipedia images (async, used server-side)
export async function getAnimals() {
  const enriched = await Promise.all(
    animalsData.map(async (animal) => {
      const image = animal.wikiTitle
        ? await fetchWikiImage(animal.wikiTitle)
        : FALLBACK_IMAGE
      return { ...animal, image }
    })
  )
  return enriched
}

export function filterAnimals(animals, { search = '', type = 'all', region = 'all' } = {}) {
  return animals.filter(animal => {
    const matchName   = animal.name.toLowerCase().includes(search.toLowerCase())
    const matchType   = type === 'all'   || animal.type === type
    const matchRegion = region === 'all' || animal.region === region
    return matchName && matchType && matchRegion
  })
}

export function getRegions(animals) {
  return [...new Set(animals.map(a => a.region))].sort()
}
