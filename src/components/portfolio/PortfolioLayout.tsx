'use client'

import { PortfolioData } from '@/types/portfolio'
import PortfolioMain from './PortfolioMain'
import PortfolioExpertise from './PortfolioExpertise'
import PortfolioTimeline from './PortfolioTimeline'
import PortfolioProjects from './PortfolioProjects'

interface Props { data: PortfolioData }

const BG_GRADIENTS: Record<string, string> = {
  space: 'linear-gradient(135deg, #0a0015 0%, #0d0221 50%, #000510 100%)',
  geometric: 'linear-gradient(135deg, #060614 0%, #0f0c29 50%, #080020 100%)',
  waves: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0c0820 100%)',
  abstract: 'linear-gradient(135deg, #0a0014 0%, #12002a 50%, #050010 100%)',
}

export default function PortfolioLayout({ data }: Props) {
  const hasBgImage = !!data.bgImageUrl

  return (
    <div className="min-h-screen text-white" style={{ background: BG_GRADIENTS[data.bgTheme] ?? BG_GRADIENTS.space }}>

      {/* Background image with heavy dark overlay */}
      {hasBgImage && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${data.bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.82)' }} />
        </div>
      )}

      {/* Content layer */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="font-bold text-lg tracking-widest text-purple-400">{data.initials}</span>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
              <a href="#hero" className="hover:text-white transition-colors">Home</a>
              <a href="#skills" className="hover:text-white transition-colors">Skills</a>
              <a href="#history" className="hover:text-white transition-colors">Experience</a>
              <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            </div>
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="text-sm font-semibold bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-full transition-colors"
              >
                Contact Me
              </a>
            )}
          </div>
        </nav>

        <PortfolioMain data={data} />

        {/* Section divider */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-800/50 to-transparent" />
        </div>

        <PortfolioExpertise data={data} />

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-800/50 to-transparent" />
        </div>

        <PortfolioTimeline data={data} />

        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-800/50 to-transparent" />
        </div>

        <PortfolioProjects data={data} />

        <footer className="border-t border-white/10 py-10 text-center">
          <p className="text-gray-600 text-sm">Built with PortfolioBot</p>
        </footer>
      </div>
    </div>
  )
}
