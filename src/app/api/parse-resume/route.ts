import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { extractText } from 'unpdf'
import { PortfolioData } from '@/types/portfolio'

function makeInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const EXTRACTION_PROMPT = `You are a resume parser. Extract structured data from the resume text below and return valid JSON only. No markdown, no explanation, no code fences — just raw JSON.

Schema:
{
  "name": "Full Name",
  "title": "Current Job Title",
  "summary": "2-3 sentence professional summary",
  "email": "email@example.com",
  "phone": "+1 (xxx) xxx-xxxx or null",
  "github": "https://github.com/username or null",
  "linkedin": "https://linkedin.com/in/username or null",
  "skills": [
    { "category": "Category Name", "items": ["skill1", "skill2"] }
  ],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "period": "Month Year – Month Year",
      "bullets": ["achievement 1", "achievement 2"]
    }
  ],
  "education": [
    { "degree": "Degree Name", "school": "School Name", "year": "Year" }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "2-3 sentence description",
      "gradient": "linear-gradient(135deg, #5000ca 0%, #00b4d8 100%)",
      "link": null
    }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    let resumeText: string
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (isPdf) {
      const { text } = await extractText(buffer, { mergePages: true })
      resumeText = text
    } else {
      resumeText = Buffer.from(bytes).toString('utf-8')
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: resumeText.slice(0, 12000) },
      ],
      temperature: 0.1,
    })

    let raw = completion.choices[0].message.content?.trim() ?? '{}'
    raw = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

    const parsed = JSON.parse(raw) as Partial<PortfolioData>
    parsed.initials = makeInitials(parsed.name ?? 'U')
    parsed.style = 'minimal'
    parsed.bgTheme = 'space'

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Resume parse error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
