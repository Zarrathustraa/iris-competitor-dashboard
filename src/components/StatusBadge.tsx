import type { CompetitorStatus } from '@/types'

const STATUS_CONFIG: Record<CompetitorStatus, { label: string; dot: string }> = {
  growing: { label: 'Growing', dot: 'bg-green-400' },
  stable: { label: 'Stable', dot: 'bg-yellow-400' },
  declining: { label: 'Declining', dot: 'bg-red-400' },
  stealth: { label: 'Stealth', dot: 'bg-gray-400' },
}

export function StatusBadge({ status }: { status: CompetitorStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
