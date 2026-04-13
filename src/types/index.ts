export type CompetitorTier = 'direct' | 'adjacent' | 'enterprise' | 'new-entrant'
export type CompetitorStatus = 'growing' | 'stable' | 'declining' | 'stealth'

export interface FundingRound {
  date: string
  amount: string
  round: string
  investors: string[]
}

export interface ProductUpdate {
  date: string
  title: string
  description: string
  source?: string
}

export interface Competitor {
  id: string
  name: string
  tagline: string
  website: string
  twitter?: string
  tier: CompetitorTier
  status: CompetitorStatus
  founded: number
  hq: string
  country: string
  coordinates: [number, number] // [lng, lat]
  totalFunding: string
  valuation?: string
  latestFunding: FundingRound
  recentUpdates: ProductUpdate[]
  strengths: string[]
  weaknesses: string[]
  keyProduct: string
  teamSize?: string
  targetAudience: string
  primaryModel: string // business model
  irisOverlapScore: number // 0-10, how much they overlap with IRIS
  color: string // brand color for map pin
}

export interface IRISProfile {
  name: string
  tagline: string
  version: string
  gtmStage: string
  targetAudience: string
  coreFeatures: string[]
  currentTraction: string
  fundraisingStatus: string
  topStrengths: string[]
  currentWeaknesses: string[]
  arrTarget: string
  keyInsights: StrategicInsight[]
}

export interface StrategicInsight {
  id: string
  category: 'opportunity' | 'threat' | 'lesson'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  source: string
  dateAdded: string
}
