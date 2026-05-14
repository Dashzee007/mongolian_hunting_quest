'use client'

import { useState, useRef, useEffect } from 'react'

const ANIMAL_TYPES = [
  { value: 'all',           label: 'Бүгд' },
  { value: 'Хөхтөн',        label: 'Хөхтөн' },
  { value: 'Шувуу',          label: 'Шувуу' },
  { value: 'Холимог идэшт',  label: 'Холимог идэшт' },
]

export default function SearchBar({ search, type, animals, onSearchChange, onTypeChange }) {
  const [suggestions, setSuggestions] = useState([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)

  // Compute suggestions whenever search or type changes
  useEffect(() => {
    if (!search.trim()) { setSuggestions([]); return }

    const names = [...new Set(
      animals
        .filter(a =>
          a.name.toLowerCase().includes(search.toLowerCase()) &&
          (type === 'all' || a.type === type)
        )
        .map(a => a.name)
    )].slice(0, 6)

    setSuggestions(names)
    setActiveIndex(-1)
  }, [search, type, animals])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (!wrapperRef.current?.contains(e.target)) setSuggestions([])
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e) {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      onSearchChange(suggestions[activeIndex])
      setSuggestions([])
    } else if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  function selectSuggestion(name) {
    onSearchChange(name)
    setSuggestions([])
  }

  return (
    <div className="search-bar" ref={wrapperRef} role="search">
      <label htmlFor="search" className="sr-only">Амьтдыг хайх</label>

      <input
        id="search"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Амьтан хайх…"
        aria-label="Амьтдыг хайх"
        autoComplete="off"
      />

      <select
        value={type}
        onChange={e => onTypeChange(e.target.value)}
        aria-label="Төрлөөр шүүх"
      >
        {ANIMAL_TYPES.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <button className="search-btn" type="button" onClick={() => setSuggestions([])}>
        Хайх
      </button>

      {suggestions.length > 0 && (
        <ul className="suggestions" aria-label="Хайлтын санал">
          {suggestions.map((name, i) => (
            <li
              key={name}
              className={i === activeIndex ? 'active' : ''}
              onClick={() => selectSuggestion(name)}
              role="option"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
