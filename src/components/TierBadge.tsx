import type { CompetitorTier } from '@/types'

const TIER_CONFIG: Record<CompetitorTier, { label: string; className: string }> = {
  'direct': { label: 'Direct', className: 'bg-red-900/50 text-red-300 border border-red-700' },
  'new-entrant': { label: 'New Entrant', className: 'bg-orange-900/50 text-orange-300 border border-orange-700' },
  'adjacent': { label: 'Adjacent', className: 'bg-violet-900/50 text-violet-300 border border-violet-700' },
  'enterprise': { label: 'Enterprise', className: 'bg-blue-900/50 text-blue-300 border border-blue-700' },
}

export function TierBadge({ tier }: { tier: CompetitorTier }) {
  const config = TIER_CONFIG[tier]
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
