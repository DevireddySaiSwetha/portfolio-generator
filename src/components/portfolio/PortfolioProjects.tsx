'use client'

import { PortfolioData } from '@/types/portfolio'

interface Props { data: PortfolioData }

const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #5000ca 0%, #00b4d8 100%)',
  'linear-gradient(135deg, #0077b6 0%, #48cae4 100%)',
  'linear-gradient(135deg, #7b2d8b 0%, #e040fb 100%)',
  'linear-gradient(135deg, #023e8a 0%, #90e0ef 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #533483 100%)',
  'linear-gradient(135deg, #0f3460 0%, #00b4d8 100%)',
]

export default function PortfolioProjects({ data }: Props) {
  if (!data.projects?.length) return null

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">What I Built</p>
          <h2 className="text-4xl font-black text-white">High-Impact Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Gradient banner */}
              <div
                className="h-36 flex items-end p-5"
                style={{ background: project.gradient || DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length] }}
              >
                <span className="text-white font-bold text-sm leading-tight drop-shadow">
                  {project.title}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium mt-4 transition-colors"
                  >
                    View project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
