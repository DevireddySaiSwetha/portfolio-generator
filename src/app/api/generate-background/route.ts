import { NextRequest, NextResponse } from 'next/server'
import { BgTheme } from '@/types/portfolio'

const PROMPTS: Record<BgTheme, string> = {
  space: 'dark deep space background, 3D wireframe constellation, neon blue and purple glowing lines, stars, cosmic nebula, ultra detailed, 4k',
  geometric: 'abstract 3D geometric mesh, low-poly wireframe, dark background, purple and teal gradient glow, digital art, ultra detailed',
  waves: 'fluid gradient waves, abstract background, deep purple and blue, smooth flowing curves, dark background, 4k',
  abstract: 'abstract 3D wireframe glowing sphere, floating particles, dark space background, purple neon edges, sci-fi digital art',
}

const DEFAULT_BG_URLS: Record<BgTheme, string> = {
  space: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80',
  geometric: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
  waves: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
  abstract: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80',
}

export async function POST(req: NextRequest) {
  try {
    const { bgTheme } = await req.json() as { bgTheme: BgTheme }
    const theme = bgTheme ?? 'space'

    if (!process.env.FAL_API_KEY) {
      return NextResponse.json({ url: DEFAULT_BG_URLS[theme] })
    }

    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: PROMPTS[theme],
        image_size: 'landscape_16_9',
        num_inference_steps: 4,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ url: DEFAULT_BG_URLS[theme] })
    }

    const data = await response.json()
    const url = data?.images?.[0]?.url ?? DEFAULT_BG_URLS[theme]
    return NextResponse.json({ url })
  } catch {
    const { bgTheme } = await req.json().catch(() => ({ bgTheme: 'space' as BgTheme }))
    return NextResponse.json({ url: DEFAULT_BG_URLS[bgTheme as BgTheme] ?? DEFAULT_BG_URLS.space })
  }
}
