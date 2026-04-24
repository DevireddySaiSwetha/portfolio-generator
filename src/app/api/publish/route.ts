import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PortfolioData } from '@/types/portfolio'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40)
}

async function makeUniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string): Promise<string> {
  let slug = base
  let i = 1
  while (true) {
    const { data } = await supabase.from('portfolios').select('id').eq('slug', slug).maybeSingle()
    if (!data) return slug
    slug = `${base}-${i++}`
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, portfolioData } = await req.json() as {
      userId: string
      portfolioData: Partial<PortfolioData>
    }

    if (!userId || !portfolioData) {
      return NextResponse.json({ error: 'Missing userId or portfolioData' }, { status: 400 })
    }

    const bgRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bgTheme: portfolioData.bgTheme ?? 'space' }),
    })
    const { url: bgImageUrl } = await bgRes.json()

    const fullData: PortfolioData = {
      name: portfolioData.name ?? 'My Portfolio',
      title: portfolioData.title ?? 'Software Engineer',
      summary: portfolioData.summary ?? '',
      initials: portfolioData.initials ?? 'ME',
      email: portfolioData.email ?? '',
      phone: portfolioData.phone,
      github: portfolioData.github,
      linkedin: portfolioData.linkedin,
      skills: portfolioData.skills ?? [],
      experience: portfolioData.experience ?? [],
      education: portfolioData.education ?? [],
      projects: portfolioData.projects ?? [],
      style: portfolioData.style ?? 'minimal',
      bgTheme: portfolioData.bgTheme ?? 'space',
      bgImageUrl,
    }

    const supabase = await createClient()
    const baseSlug = slugify(fullData.name)
    const slug = await makeUniqueSlug(supabase, baseSlug)

    const { data: existing } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let result
    if (existing) {
      result = await supabase
        .from('portfolios')
        .update({ slug, portfolio_json: fullData, bg_image_url: bgImageUrl, status: 'published' })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('portfolios')
        .insert({ user_id: userId, slug, portfolio_json: fullData, bg_image_url: bgImageUrl, status: 'published' })
        .select()
        .single()
    }

    if (result.error) throw result.error

    return NextResponse.json({ slug, id: result.data.id })
  } catch (err) {
    console.error('Publish error:', err)
    return NextResponse.json({ error: 'Failed to publish portfolio' }, { status: 500 })
  }
}
