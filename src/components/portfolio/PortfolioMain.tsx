'use client'

import { PortfolioData } from '@/types/portfolio'

interface Props { data: PortfolioData }

export default function PortfolioMain({ data }: Props) {
  return (
    <section id="hero" className="min-h-[92vh] flex items-center px-6 py-24">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-14">

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div
                className="w-44 h-44 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              >
                {data.initials}
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-md -z-10" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Social icons */}
            <div className="flex gap-4 mb-5 justify-center md:justify-start">
              {data.github && (
                <a href={data.github} target="_blank" rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {data.linkedin && (
                <a href={data.linkedin} target="_blank" rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </a>
              )}
              {data.phone && (
                <a href={`tel:${data.phone}`}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-purple-600 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </a>
              )}
            </div>

            <p className="text-purple-400 font-semibold text-sm tracking-widest uppercase mb-3">
              {data.title}
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              {data.name}
            </h1>
            {data.summary && (
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-8">
                {data.summary}
              </p>
            )}

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {data.email && (
                <a href={`mailto:${data.email}`}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                  Get In Touch
                </a>
              )}
              <a href="#projects"
                className="border border-white/20 hover:border-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-colors">
                View My Work
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
