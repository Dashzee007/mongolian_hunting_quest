'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAnimals } from '@/hooks/useAnimals'

// Fix Leaflet's broken default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const REGION_COORDS = {
  'Хангай':     [47.5, 100.5],
  'Алтай':      [46.5,  91.0],
  'Говь':       [44.0, 104.0],
  'Говь-Алтай': [46.0,  96.0],
  'Хэнтий':     [47.8, 109.5],
  'Дархад':     [51.0,  99.5],
  'Увс':        [50.0,  92.5],
  'Хөвсгөл':   [50.5, 100.5],
  'Сэлэнгэ':   [49.5, 103.5],
  'Завхан':     [48.0,  96.5],
  'Дорнод':     [47.5, 115.5],
  'Баянхонгор': [46.0, 100.0],
  'Орхон':      [47.7, 103.0],
  'Сүхбаатар': [46.5, 113.5],
  'Говьсүмбэр': [46.5, 108.0],
  'Булган':     [48.5, 103.0],
  'Дархан-Уул': [49.5, 105.9],
  'Төв':        [47.5, 106.5],
}

const TYPE_COLOR = {
  'Хөхтөн':       '#40916c',
  'Шувуу':         '#3b82f6',
  'Холимог идэшт': '#f59e0b',
}

const TYPE_EMOJI = {
  'Хөхтөн':       '🦌',
  'Шувуу':         '🦅',
  'Холимог идэшт': '🐻',
}

function dominantType(list) {
  const counts = list.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function makeIcon(type, count) {
  const color = TYPE_COLOR[type] || '#40916c'
  const size  = count > 5 ? 44 : 36
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:${size > 40 ? 17 : 14}px;line-height:1">${TYPE_EMOJI[type] || '📍'}</span></div>`,
    className:   '',
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size],
    popupAnchor: [0, -(size + 4)],
  })
}

export default function MapClient() {
  const { animals } = useAnimals()

  const mapRef         = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef     = useRef({})

  const [selected,     setSelected]     = useState(null)  // { region, list }
  const [detailOpen,   setDetailOpen]   = useState(false)
  const [regionSearch, setRegionSearch] = useState('')
  const [mobilePanel,  setMobilePanel]  = useState(false)

  // Group by region
  const byRegion = useMemo(() =>
    animals.reduce((acc, a) => {
      (acc[a.region] = acc[a.region] || []).push(a)
      return acc
    }, {}),
    [animals]
  )

  const sortedRegions = useMemo(() =>
    Object.entries(byRegion).sort((a, b) => b[1].length - a[1].length),
    [byRegion]
  )

  const visibleRegions = useMemo(() =>
    sortedRegions.filter(([r]) => r.toLowerCase().includes(regionSearch.toLowerCase())),
    [sortedRegions, regionSearch]
  )

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center:      [46.8, 103.8],
      zoom:        5,
      minZoom:     4,
      maxZoom:     14,
      zoomControl: false,
    })

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { attribution: '© <a href="https://carto.com/">CARTO</a> | © OpenStreetMap contributors' }
    ).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Add markers when animals update
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !animals.length) return

    // Remove old markers
    Object.values(markersRef.current).forEach(({ marker }) => marker.remove())
    markersRef.current = {}

    Object.entries(byRegion).forEach(([region, list]) => {
      const coords = REGION_COORDS[region]
      if (!coords) return

      const dtype = dominantType(list)

      const popupHtml = `
        <div class="map-popup">
          <h3>${region}</h3>
          <p class="popup-count">📍 ${list.length} амьтан бүртгэлтэй</p>
          <ul>
            ${list.slice(0, 6).map(a =>
              `<li>${TYPE_EMOJI[a.type] || ''} ${a.name} <em>${a.type}</em></li>`
            ).join('')}
            ${list.length > 6 ? `<li style="color:var(--text-muted)">… өөр ${list.length - 6}</li>` : ''}
          </ul>
        </div>`

      const marker = L.marker(coords, { icon: makeIcon(dtype, list.length) })
        .addTo(map)
        .bindPopup(popupHtml, { maxWidth: 260, closeButton: false })

      marker.on('click', () => {
        setSelected({ region, list })
        setDetailOpen(true)
      })

      markersRef.current[region] = { marker, list }
    })
  }, [animals, byRegion])

  function flyToRegion(region) {
    const data = markersRef.current[region]
    if (!data) return

    mapInstanceRef.current?.flyTo(data.marker.getLatLng(), 8, {
      duration: 1.2, easeLinearity: 0.25,
    })

    setTimeout(() => {
      data.marker.openPopup()
      setSelected({ region, list: data.list })
      setDetailOpen(true)
    }, 900)

    if (window.innerWidth <= 480) setMobilePanel(false)
  }

  return (
    <div className="map-page-wrap">

      {/* Mobile panel toggle */}
      <button
        className="gmap-toggle"
        onClick={() => setMobilePanel(v => !v)}
        aria-label="Хайлтыг нээх/хаах"
      >
        ☰
      </button>

      {/* Left sidebar panel */}
      <div className={`gmap-panel${mobilePanel ? ' mobile-open' : ''}`}>

        <div className="gmap-search-box">
          <span className="gmap-search-icon">🔍</span>
          <input
            placeholder="Бүс нутаг хайх…"
            value={regionSearch}
            onChange={e => setRegionSearch(e.target.value)}
          />
        </div>

        <div className="gmap-regions">
          <div className="gmap-regions-header">Бүс нутгууд</div>
          <ul className="region-list">
            {visibleRegions.map(([region, list]) => {
              const coords = REGION_COORDS[region]
              const dtype  = dominantType(list)
              const color  = TYPE_COLOR[dtype] || '#40916c'
              const counts = list.reduce((acc, a) => {
                acc[a.type] = (acc[a.type] || 0) + 1
                return acc
              }, {})

              return (
                <li
                  key={region}
                  className={[
                    'region-item',
                    !coords          ? 'region-no-coords' : '',
                    selected?.region === region ? 'active' : '',
                  ].join(' ').trim()}
                  onClick={() => coords && flyToRegion(region)}
                  role="button"
                  tabIndex={coords ? 0 : -1}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ' ') && coords) flyToRegion(region)
                  }}
                  aria-label={`${region} бүс рүү шилжих`}
                >
                  <span className="region-dot" style={{ background: color }} />
                  <div className="region-info">
                    <span className="region-name">{region}</span>
                    <span className="region-count">{list.length} амьтан</span>
                  </div>
                  <div className="region-badges">
                    {Object.entries(counts).map(([t, n]) => (
                      <span
                        key={t}
                        className="region-badge"
                        style={{ background: TYPE_COLOR[t] }}
                      >
                        {TYPE_EMOJI[t]} {n}
                      </span>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Leaflet map */}
      <div ref={mapRef} style={{ flex: 1, height: '100%', zIndex: 1 }} />

      {/* Right detail panel */}
      <div className={`gmap-detail${detailOpen ? ' open' : ''}`}>
        <div className="gmap-detail-header">
          <h3>{selected?.region || ''}</h3>
          <button
            className="gmap-detail-close"
            onClick={() => setDetailOpen(false)}
            aria-label="Хаах"
          >
            ✕
          </button>
        </div>

        <div className="gmap-detail-body" id="detailBody">
          {selected && (() => {
            const { list } = selected
            const counts = list.reduce((acc, a) => {
              acc[a.type] = (acc[a.type] || 0) + 1
              return acc
            }, {})
            return (
              <>
                <div className="gmap-detail-stat">
                  <span>Нийт амьтан</span>
                  <span>{list.length}</span>
                </div>
                {Object.entries(counts).map(([t, n]) => (
                  <div key={t} className="gmap-detail-stat">
                    <span>{TYPE_EMOJI[t]} {t}</span>
                    <span>{n}</span>
                  </div>
                ))}
                <div className="gmap-detail-animals">
                  {list.map(a => (
                    <div key={a.name} className="mini-card">
                      <img
                        src={a.image}
                        alt={a.name}
                        onError={e => { e.target.style.visibility = 'hidden' }}
                      />
                      <div>
                        <div className="mini-card-name">{a.name}</div>
                        <div className="mini-card-type">{TYPE_EMOJI[a.type]} {a.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot dot-mammal" />Хөхтөн
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-bird" />Шувуу
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-mixed" />Холимог
        </div>
      </div>

    </div>
  )
}
