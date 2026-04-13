import { useState, useMemo } from 'react'
import { COMPETITORS } from '@/data/competitors'
import type { Competitor } from '@/types'
import { TierBadge } from '@/components/TierBadge'
import { StatusBadge } from '@/components/StatusBadge'
import { Search, ExternalLink, TrendingUp, TrendingDown, ChevronDown, ChevronUp, DollarSign } from 'lucide-react'

type SortKey = 'name' | 'irisOverlapScore' | 'totalFunding' | 'founded'

export function CompetitorsPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('irisOverlapScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  const sorted = useMemo(() => {
    let result = COMPETITORS.filter(c =>
      (tierFilter === 'all' || c.tier === tierFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.tagline.toLowerCase().includes(search.toLowerCase()))
    )
    result = [...result].sort((a, b) => {
      let va: string | number = a[sortKey] ?? 0
      let vb: string | number = b[sortKey] ?? 0
      if (sortKey === 'totalFunding') {
        va = parseFloat(String(a.totalFunding).replace(/[^0-9.]/g, '')) || 0
        vb = parseFloat(String(b.totalFunding).replace(/[^0-9.]/g, '')) || 0
      }
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
    return result
  }, [search, tierFilter, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  function SortBtn({ label, k }: { label: string; k: SortKey }) {
    const active = sortKey === k
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors ${active ? 'bg-violet-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
      >
        {label}
        {active && (sortDir === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />)}
      </button>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Competitor Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">{COMPETITORS.length} companies tracked · Updated April 2025</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search competitors..."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 w-52"
            />
          </div>
          {(['all', 'new-entrant', 'adjacent', 'enterprise'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tierFilter === t ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {t === 'all' ? 'All' : t === 'new-entrant' ? 'New Entrants' : t === 'adjacent' ? 'Adjacent' : 'Enterprise'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">Sort by:</span>
        <SortBtn label="IRIS Overlap" k="irisOverlapScore" />
        <SortBtn label="Funding" k="totalFunding" />
        <SortBtn label="Name" k="name" />
        <SortBtn label="Founded" k="founded" />
        <span className="ml-auto text-xs text-gray-600">{sorted.length} results</span>
      </div>

      <div className="space-y-3">
        {sorted.map(c => (
          <CompetitorCard key={c.id} competitor={c} expanded={expanded === c.id} onToggle={() => setExpanded(prev => prev === c.id ? null : c.id)} />
        ))}
      </div>
    </div>
  )
}

function CompetitorCard({ competitor: c, expanded, onToggle }: { competitor: Competitor; expanded: boolean; onToggle: () => void }) {
  const overlapColor = c.irisOverlapScore >= 7 ? 'text-red-400' : c.irisOverlapScore >= 5 ? 'text-orange-400' : 'text-green-400'

  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden transition-colors ${expanded ? 'border-violet-600' : 'border-gray-800 hover:border-gray-700'}`}>
      {/* Summary row */}
      <button className="w-full text-left p-4" onClick={onToggle}>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: c.color }}>
            {c.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-white">{c.name}</span>
              <TierBadge tier={c.tier} />
              <StatusBadge status={c.status} />
            </div>
            <p className="text-xs text-gray-400 truncate">{c.tagline}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500">Funding</div>
              <div className="text-sm font-bold text-green-400 flex items-center gap-0.5"><DollarSign size={10} />{c.totalFunding.replace('$','')}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">IRIS Overlap</div>
              <div className={`text-sm font-bold ${overlapColor}`}>{c.irisOverlapScore}/10</div>
            </div>
            <div className="text-gray-500">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">HQ</div>
              <div className="text-sm font-medium text-white">{c.hq}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Founded</div>
              <div className="text-sm font-medium text-white">{c.founded}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Business Model</div>
              <div className="text-sm font-medium text-white">{c.primaryModel}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Target Market</div>
              <div className="text-sm font-medium text-white text-wrap leading-tight">{c.targetAudience}</div>
            </div>
          </div>

          {/* Funding detail */}
          <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">Latest Funding Round</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg font-bold text-green-400">{c.latestFunding.amount}</span>
              <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded">{c.latestFunding.round}</span>
              <span className="text-xs text-gray-500">{c.latestFunding.date}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lead investors: {c.latestFunding.investors.join(', ')}</p>
          </div>

          {/* Recent updates */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recent Product Updates</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {c.recentUpdates.map((u, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-400">{u.title}</span>
                    <span className="text-xs text-gray-600">{u.date}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{u.description}</p>
                  {u.source && <p className="text-xs text-gray-600 mt-1">via {u.source}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={12} className="text-green-400" />
                <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">Strengths</p>
              </div>
              <ul className="space-y-1.5">
                {c.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown size={12} className="text-red-400" />
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">Weaknesses</p>
              </div>
              <ul className="space-y-1.5">
                {c.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key product + links */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1 border-t border-gray-800">
            <p className="text-xs text-gray-500"><span className="text-gray-400 font-medium">Key product:</span> {c.keyProduct}</p>
            <div className="flex gap-2">
              <a href={c.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 bg-violet-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                <ExternalLink size={10} /> Website
              </a>
              {c.twitter && (
                <a href={`https://twitter.com/${c.twitter.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                  <ExternalLink size={10} /> {c.twitter}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
