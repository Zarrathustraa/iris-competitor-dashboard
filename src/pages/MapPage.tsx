import { useState, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { COMPETITORS } from '@/data/competitors'
import type { Competitor } from '@/types'
import { CompetitorPopup } from '@/components/CompetitorPopup'
import { TierBadge } from '@/components/TierBadge'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const TIER_LABELS: Record<string, string> = {
  'direct': 'Direct',
  'new-entrant': 'New Entrant',
  'adjacent': 'Adjacent',
  'enterprise': 'Enterprise',
}

const TIER_COLORS: Record<string, string> = {
  'direct': '#ef4444',
  'new-entrant': '#f97316',
  'adjacent': '#a78bfa',
  'enterprise': '#60a5fa',
}

export function MapPage() {
  const [selected, setSelected] = useState<Competitor | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? COMPETITORS : COMPETITORS.filter(c => c.tier === filter)

  const handleSelect = useCallback((c: Competitor) => {
    setSelected(prev => prev?.id === c.id ? null : c)
  }, [])

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-950">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/50">
        <div>
          <h1 className="text-base font-bold text-white">Competitive Landscape — World Map</h1>
          <p className="text-xs text-gray-500 mt-0.5">{COMPETITORS.length} competitors tracked · Click a pin to explore</p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'new-entrant', 'adjacent', 'enterprise'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setFilter(tier)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === tier
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tier === 'all' ? 'All' : TIER_LABELS[tier]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <ComposableMap
            projection="geoMercator"
            style={{ width: '100%', height: '100%', background: '#0f172a' }}
          >
            <ZoomableGroup zoom={1} center={[0, 20]}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: unknown[] }) =>
                  geographies.map((geo: unknown) => {
                    const g = geo as { rsmKey: string }
                    return (
                      <Geography
                        key={g.rsmKey}
                        geography={geo}
                        fill="#1e293b"
                        stroke="#334155"
                        strokeWidth={0.5}
                        style={{ default: { outline: 'none' }, hover: { outline: 'none', fill: '#253347' }, pressed: { outline: 'none' } }}
                      />
                    )
                  })
                }
              </Geographies>

              {filtered.map(competitor => (
                <Marker
                  key={competitor.id}
                  coordinates={competitor.coordinates}
                  onClick={() => handleSelect(competitor)}
                >
                  <circle
                    r={selected?.id === competitor.id ? 9 : 6}
                    fill={TIER_COLORS[competitor.tier] ?? competitor.color}
                    stroke={selected?.id === competitor.id ? '#fff' : '#0f172a'}
                    strokeWidth={selected?.id === competitor.id ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                  />
                  <text
                    textAnchor="middle"
                    y={-12}
                    fontSize={9}
                    fill="#e2e8f0"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {competitor.name}
                  </text>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 rounded-xl p-3 border border-gray-700">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Tier Legend</p>
            {Object.entries(TIER_LABELS).map(([tier, label]) => (
              <div key={tier} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: TIER_COLORS[tier] }} />
                <span className="text-xs text-gray-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Stats overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            {(['new-entrant', 'adjacent', 'enterprise'] as const).map(tier => {
              const count = COMPETITORS.filter(c => c.tier === tier).length
              return (
                <div key={tier} className="bg-gray-900/90 rounded-lg px-3 py-2 border border-gray-700 text-center">
                  <div className="text-lg font-bold" style={{ color: TIER_COLORS[tier] }}>{count}</div>
                  <div className="text-xs text-gray-500">{TIER_LABELS[tier]}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-80 border-l border-gray-800 overflow-y-auto bg-gray-900/30">
          {selected ? (
            <CompetitorPopup competitor={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-500 text-center mt-8">Select a competitor on the map to view details</p>
              <div className="mt-6 space-y-2">
                {filtered.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: TIER_COLORS[c.tier] }} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-200 truncate">{c.name}</div>
                      <div className="text-xs text-gray-500 truncate">{c.hq}</div>
                    </div>
                    <TierBadge tier={c.tier} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
