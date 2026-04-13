import { useState } from 'react'
import { IRIS_PROFILE, STRATEGIC_INSIGHTS } from '@/data/iris'
import { COMPETITORS } from '@/data/competitors'
import type { StrategicInsight } from '@/types'
import { Lightbulb, AlertTriangle, BookOpen, TrendingUp, TrendingDown, Target, Zap, ExternalLink, RefreshCw } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const INSIGHT_CONFIG = {
  opportunity: { icon: Lightbulb, color: 'text-green-400', bg: 'bg-green-950/30', border: 'border-green-900/50', label: 'Opportunity' },
  threat: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-900/50', label: 'Threat' },
  lesson: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-950/30', border: 'border-blue-900/50', label: 'Lesson' },
}

const PRIORITY_BADGE = {
  high: 'bg-red-900/50 text-red-300',
  medium: 'bg-yellow-900/50 text-yellow-300',
  low: 'bg-gray-800 text-gray-400',
}

// Build radar data from IRIS attributes vs competitors
const radarData = [
  { subject: 'Voice', iris: 7, avgComp: 2 },
  { subject: 'Memory', iris: 9, avgComp: 3 },
  { subject: 'Execution', iris: 7, avgComp: 5 },
  { subject: 'Integrations', iris: 9, avgComp: 6 },
  { subject: 'Feed/Proactive', iris: 8, avgComp: 1 },
  { subject: 'Enterprise', iris: 3, avgComp: 7 },
  { subject: 'Brand', iris: 3, avgComp: 7 },
  { subject: 'Mobile', iris: 6, avgComp: 5 },
]

// Overlap score chart data
const overlapData = COMPETITORS
  .sort((a, b) => b.irisOverlapScore - a.irisOverlapScore)
  .map(c => ({ name: c.name.length > 12 ? c.name.slice(0, 12) + '..' : c.name, score: c.irisOverlapScore, color: c.color }))

export function StrategyPage() {
  const [insightFilter, setInsightFilter] = useState<'all' | 'opportunity' | 'threat' | 'lesson'>('all')
  const [lastRefreshed] = useState('April 13, 2025')

  const filteredInsights = insightFilter === 'all'
    ? STRATEGIC_INSIGHTS
    : STRATEGIC_INSIGHTS.filter(i => i.category === insightFilter)

  const opportunities = STRATEGIC_INSIGHTS.filter(i => i.category === 'opportunity').length
  const threats = STRATEGIC_INSIGHTS.filter(i => i.category === 'threat').length
  const lessons = STRATEGIC_INSIGHTS.filter(i => i.category === 'lesson').length
  const highPriority = STRATEGIC_INSIGHTS.filter(i => i.priority === 'high').length

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">IRIS Strategy Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">Competitive positioning, strategic insights, and key learnings</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <RefreshCw size={12} />
          <span>Last updated: {lastRefreshed}</span>
        </div>
      </div>

      {/* IRIS Profile card */}
      <div className="bg-gradient-to-br from-violet-950/60 to-indigo-950/60 border border-violet-800/50 rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-white">IRIS {IRIS_PROFILE.version}</h2>
              <span className="text-xs bg-violet-800 text-violet-200 px-2 py-0.5 rounded-full">Active Development</span>
              <span className="text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded-full">Target: {IRIS_PROFILE.arrTarget}</span>
            </div>
            <p className="text-sm text-violet-200 mt-1 italic">"{IRIS_PROFILE.tagline}"</p>
            <p className="text-xs text-gray-400 mt-1">GTM: {IRIS_PROFILE.gtmStage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Core features */}
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-violet-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Zap size={10} /> Core Features
            </p>
            <ul className="space-y-1.5">
              {IRIS_PROFILE.coreFeatures.map((f, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-violet-400 flex-shrink-0 mt-0.5">◈</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <TrendingUp size={10} /> Top Strengths
            </p>
            <ul className="space-y-1.5">
              {IRIS_PROFILE.topStrengths.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <TrendingDown size={10} /> Current Weaknesses
            </p>
            <ul className="space-y-1.5">
              {IRIS_PROFILE.currentWeaknesses.map((w, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">IRIS vs Competitors — Capability Radar</h3>
          <p className="text-xs text-gray-500 mb-4">IRIS (purple) vs average competitor (blue) across key dimensions</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Radar name="IRIS" dataKey="iris" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Avg Competitor" dataKey="avgComp" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 2" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Overlap bar chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">IRIS Overlap Score by Competitor</h3>
          <p className="text-xs text-gray-500 mb-4">Higher = more competitive overlap with IRIS product space (1–10)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={overlapData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#d1d5db', fontSize: 10 }} width={90} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#f3f4f6' }}
                cursor={{ fill: '#374151' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {overlapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-950/30 border border-green-900/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{opportunities}</div>
          <div className="text-xs text-gray-500 mt-1">Opportunities</div>
        </div>
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{threats}</div>
          <div className="text-xs text-gray-500 mt-1">Active Threats</div>
        </div>
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{lessons}</div>
          <div className="text-xs text-gray-500 mt-1">Key Lessons</div>
        </div>
        <div className="bg-orange-950/30 border border-orange-900/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{highPriority}</div>
          <div className="text-xs text-gray-500 mt-1">High Priority</div>
        </div>
      </div>

      {/* Strategic insights */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-violet-400" />
            <h2 className="text-base font-bold text-white">Strategic Insights & Key Learnings</h2>
          </div>
          <div className="flex gap-2">
            {(['all', 'opportunity', 'threat', 'lesson'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setInsightFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${insightFilter === cat ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {cat === 'all' ? 'All' : INSIGHT_CONFIG[cat].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map(insight => <InsightCard key={insight.id} insight={insight} />)}
        </div>
      </div>

      {/* Data sources */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ExternalLink size={14} className="text-gray-500" /> Live Data Sources — Refresh Monthly
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: '𝕏 / Twitter', desc: 'Product launches, founder updates', url: 'https://twitter.com', color: 'text-blue-400' },
            { name: 'TechCrunch', desc: 'Funding & startup news', url: 'https://techcrunch.com', color: 'text-green-400' },
            { name: 'Crunchbase', desc: 'Funding rounds & valuations', url: 'https://crunchbase.com', color: 'text-orange-400' },
            { name: 'Product Hunt', desc: 'New launches & traction', url: 'https://producthunt.com', color: 'text-red-400' },
            { name: 'LinkedIn', desc: 'Team growth & hiring', url: 'https://linkedin.com', color: 'text-sky-400' },
            { name: 'The Verge', desc: 'Consumer AI coverage', url: 'https://theverge.com', color: 'text-purple-400' },
            { name: 'Hacker News', desc: 'Developer community pulse', url: 'https://news.ycombinator.com', color: 'text-yellow-400' },
            { name: 'SEC/EDGAR', desc: 'Enterprise funding filings', url: 'https://sec.gov', color: 'text-gray-400' },
          ].map(source => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-3 transition-colors group"
            >
              <div className={`text-xs font-bold ${source.color} mb-1 group-hover:underline`}>{source.name}</div>
              <div className="text-xs text-gray-500">{source.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function InsightCard({ insight }: { insight: StrategicInsight }) {
  const config = INSIGHT_CONFIG[insight.category]
  const Icon = config.icon

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <Icon size={14} className={`${config.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>{config.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_BADGE[insight.priority]}`}>{insight.priority} priority</span>
          </div>
          <h3 className="text-sm font-bold text-white mb-2">{insight.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-gray-600">Source: {insight.source}</span>
            <span className="text-xs text-gray-600">{insight.dateAdded}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
