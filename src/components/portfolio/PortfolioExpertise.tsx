'use client'

import { PortfolioData } from '@/types/portfolio'

interface Props { data: PortfolioData }

export default function PortfolioExpertise({ data }: Props) {
  if (!data.skills?.length) return null

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">What I Know</p>
          <h2 className="text-4xl font-black text-white">Skills & Expertise</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.skills.map((skill, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-500/40 transition-all"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, j) => (
                  <span
                    key={j}
                    className="text-xs font-medium text-purple-200 bg-purple-950/60 border border-purple-800/50 px-3 py-1.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
