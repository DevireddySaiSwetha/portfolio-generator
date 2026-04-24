import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortfolioLayout from '@/components/portfolio/PortfolioLayout'
import { Portfolio } from '@/types/portfolio'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolios')
    .select('portfolio_json')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) return { title: 'Portfolio' }

  const p = data.portfolio_json as Portfolio['portfolio_json']
  return {
    title: `${p.name} — ${p.title}`,
    description: p.summary,
  }
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('portfolios')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) notFound()

  const portfolio = data as Portfolio
  return <PortfolioLayout data={portfolio.portfolio_json} />
}
