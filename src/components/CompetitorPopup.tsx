import type { Competitor } from '@/types'
import { X, ExternalLink, TrendingUp, TrendingDown, DollarSign, Users, Calendar } from 'lucide-react'
import { TierBadge } from './TierBadge'
import { StatusBadge } from './StatusBadge'

interface Props {
  competitor: Competitor
  onClose: () => void
}

export function CompetitorPopup({ competitor: c, onClose }: Props) {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white">{c.name}</h2>
            <TierBadge tier={c.tier} />
            <StatusBadge status={c.status} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{c.tagline}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white flex-shrink-0 mt-0.5">
          <X size={14} />
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="flex items-center gap-1 text-gray-500 mb-1"><DollarSign size={10} /><span className="text-xs">Total Funding</span></div>
          <div className="text-sm font-bold text-green-400">{c.totalFunding}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <div className="flex items-center gap-1 text-gray-500 mb-1"><Calendar size={10} /><span className="text-xs">Founded</span></div>
          <div className="text-sm font-bold text-white">{c.founded}</div>
        </div>
        {c.valuation && (
          <div className="bg-gray-800 rounded-lg p-2">
            <div className="flex items-center gap-1 text-gray-500 mb-1"><TrendingUp size={10} /><span className="text-xs">Valuation</span></div>
            <div className="text-sm font-bold text-violet-400">{c.valuation}</div>
          </div>
        )}
        {c.teamSize && (
          <div className="bg-gray-800 rounded-lg p-2">
            <div className="flex items-center gap-1 text-gray-500 mb-1"><Users size={10} /><span className="text-xs">Team Size</span></div>
            <div className="text-sm font-bold text-white">{c.teamSize}</div>
          </div>
        )}
      </div>

      {/* IRIS Overlap score */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">IRIS Overlap Score</span>
          <span className="text-xs font-bold text-orange-400">{c.irisOverlapScore}/10</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${c.irisOverlapScore * 10}%`,
              background: c.irisOverlapScore >= 7 ? '#ef4444' : c.irisOverlapScore >= 5 ? '#f97316' : '#22c55e'
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {c.irisOverlapScore >= 8 ? 'Direct competitive threat' : c.irisOverlapScore >= 6 ? 'Significant overlap' : 'Partial overlap'}
        </p>
      </div>

      {/* Latest funding */}
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Latest Funding</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-green-400">{c.latestFunding.amount}</span>
          <span className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded">{c.latestFunding.round}</span>
          <span className="text-xs text-gray-500">{c.latestFunding.date}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{c.latestFunding.investors.join(', ')}</p>
      </div>

      {/* Recent updates */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Recent Updates</p>
        <div className="space-y-2">
          {c.recentUpdates.map((u, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-2.5 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-blue-400 font-medium">{u.title}</span>
                <span className="text-xs text-gray-600">{u.date}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{u.description}</p>
              {u.source && <p className="text-xs text-gray-600 mt-1">Source: {u.source}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp size={10} className="text-green-400" />
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">Strengths</p>
          </div>
          <ul className="space-y-1">
            {c.strengths.map((s, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5 flex-shrink-0">▸</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-2">
            <TrendingDown size={10} className="text-red-400" />
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">Weaknesses</p>
          </div>
          <ul className="space-y-1">
            {c.weaknesses.map((w, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                <span className="text-red-500 mt-0.5 flex-shrink-0">▸</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-2 pt-1">
        <a href={c.website} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 bg-violet-900/20 px-2 py-1 rounded-lg transition-colors">
          <ExternalLink size={10} /> Website
        </a>
        {c.twitter && (
          <a href={`https://twitter.com/${c.twitter.replace('@','')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2 py-1 rounded-lg transition-colors">
            <ExternalLink size={10} /> {c.twitter}
          </a>
        )}
      </div>
    </div>
  )
}
