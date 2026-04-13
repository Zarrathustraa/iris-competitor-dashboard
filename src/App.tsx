import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { MapPage } from '@/pages/MapPage'
import { CompetitorsPage } from '@/pages/CompetitorsPage'
import { StrategyPage } from '@/pages/StrategyPage'
import { Globe, LayoutGrid, Lightbulb, Zap } from 'lucide-react'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 h-14">
            <div className="flex items-center gap-2 mr-6">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm tracking-wide">IRIS <span className="text-gray-500 font-normal">Intelligence</span></span>
            </div>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
              }
            >
              <Globe size={14} /> World Map
            </NavLink>
            <NavLink
              to="/competitors"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
              }
            >
              <LayoutGrid size={14} /> Competitors
            </NavLink>
            <NavLink
              to="/strategy"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
              }
            >
              <Lightbulb size={14} /> Strategy
            </NavLink>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-500">Live data sources:</span>
              <a href="https://twitter.com/search?q=AI+assistant" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-blue-400 transition-colors">𝕏 / Twitter</a>
              <a href="https://techcrunch.com/tag/artificial-intelligence/" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-green-400 transition-colors">TechCrunch</a>
              <a href="https://www.crunchbase.com/" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-orange-400 transition-colors">Crunchbase</a>
            </div>
          </div>
        </nav>
        <main className="pt-14">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/competitors" element={<CompetitorsPage />} />
            <Route path="/strategy" element={<StrategyPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
