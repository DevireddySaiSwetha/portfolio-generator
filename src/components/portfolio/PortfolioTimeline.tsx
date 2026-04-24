'use client'

import { PortfolioData } from '@/types/portfolio'

interface Props { data: PortfolioData }

export default function PortfolioTimeline({ data }: Props) {
  const items = [
    ...(data.experience ?? []).map(e => ({ ...e, type: 'work' as const })),
    ...(data.education ?? []).map(e => ({
      role: e.degree,
      company: e.school,
      period: e.year,
      bullets: [] as string[],
      type: 'edu' as const,
    })),
  ]

  if (!items.length) return null

  return (
    <section id="history" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">My Journey</p>
          <h2 className="text-4xl font-black text-white">Career History</h2>
        </div>

        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="flex gap-6">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-lg ${
                  item.type === 'work'
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                    : 'bg-gradient-to-br from-cyan-600 to-teal-600'
                }`}>
                  {item.type === 'work' ? '💼' : '🎓'}
                </div>
                {i < items.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-purple-700/50 to-transparent mt-3" />
                )}
              </div>

              {/* Card */}
              <div className="flex-1 pb-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{item.role}</h3>
                      <p className="text-purple-400 font-medium mt-1">{item.company}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>

                  {item.bullets?.length > 0 && (
                    <ul className="space-y-2 mt-2">
                      {item.bullets.map((b, j) => (
                        <li key={j} className="text-gray-400 text-sm flex gap-3 leading-relaxed">
                          <span className="text-purple-500 mt-1.5 flex-shrink-0 text-xs">▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
