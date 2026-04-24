'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BOT_STEPS, StepId } from '@/lib/bot-steps'
import { PortfolioData } from '@/types/portfolio'

interface Message {
  from: 'bot' | 'user'
  text: string
  choices?: { label: string; value: string }[]
  type?: string
}

interface Props { userId: string }

export default function BotChat({ userId }: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [step, setStep] = useState<StepId>('welcome')
  const [parsedData, setParsedData] = useState<Partial<PortfolioData>>({})
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [portfolioSlug, setPortfolioSlug] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{ from: 'bot', text: BOT_STEPS[0].message, type: BOT_STEPS[0].type }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addBot(text: string, extra?: Partial<Message>) {
    setMessages(prev => [...prev, { from: 'bot', text, ...extra }])
  }

  function addUser(text: string) {
    setMessages(prev => [...prev, { from: 'user', text }])
  }

  async function handleFileUpload(file: File) {
    addUser(`Uploaded: ${file.name}`)
    setLoading(true)
    try {
      const form = new FormData()
      form.append('resume', file)
      const res = await fetch('/api/parse-resume', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setParsedData(data)

      const styleStep = BOT_STEPS.find(s => s.id === 'style')!
      addBot(styleStep.message, { type: styleStep.type, choices: styleStep.choices })
      setStep('style')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      addBot(`Sorry, I couldn't read that file: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleChoice(value: string, label: string) {
    addUser(label)

    if (step === 'style') {
      setParsedData(prev => ({ ...prev, style: value as PortfolioData['style'] }))
      const bgStep = BOT_STEPS.find(s => s.id === 'background')!
      addBot(bgStep.message, { type: bgStep.type, choices: bgStep.choices })
      setStep('background')
    } else if (step === 'background') {
      setParsedData(prev => ({ ...prev, bgTheme: value as PortfolioData['bgTheme'] }))

      // If no projects, auto-generate from experience entries
      const existingProjects = parsedData.projects ?? []
      const GRADIENTS = [
        'linear-gradient(135deg, #5000ca 0%, #00b4d8 100%)',
        'linear-gradient(135deg, #0077b6 0%, #48cae4 100%)',
        'linear-gradient(135deg, #023e8a 0%, #90e0ef 100%)',
        'linear-gradient(135deg, #7b2d8b 0%, #e040fb 100%)',
      ]
      const projectsFromExp = (parsedData.experience ?? []).map((exp, i) => ({
        title: `${exp.role} @ ${exp.company}`,
        description: exp.bullets?.slice(0, 2).join('. ') ?? '',
        gradient: GRADIENTS[i % GRADIENTS.length],
        link: undefined,
      }))
      const allProjects = existingProjects.length ? existingProjects : projectsFromExp
      setParsedData(prev => ({ ...prev, projects: allProjects }))

      const projectsStep = BOT_STEPS.find(s => s.id === 'projects')!
      const projectChoices = allProjects.map(p => ({ label: p.title, value: p.title }))
      addBot(
        allProjects.length
          ? projectsStep.message
          : "I didn't find explicit projects, so I've created cards from your work experience. Want to include all of them?",
        { type: 'multiselect', choices: projectChoices }
      )
      setStep('projects')
    } else if (step === 'extras') {
      setParsedData(prev => ({ ...prev, extras: value }))
      handleGenerate()
    }
  }

  function handleMultiSelect(value: string) {
    setSelectedItems(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function confirmProjects() {
    const allProjects = parsedData.projects ?? []
    const selected = selectedItems.length
      ? allProjects.filter(p => selectedItems.includes(p.title))
      : allProjects
    setParsedData(prev => ({ ...prev, projects: selected }))
    addUser(`Selected ${selected.length} project${selected.length !== 1 ? 's' : ''}`)
    const extrasStep = BOT_STEPS.find(s => s.id === 'extras')!
    addBot(extrasStep.message, { type: extrasStep.type, choices: extrasStep.choices })
    setStep('extras')
  }

  async function handleGenerate() {
    const genStep = BOT_STEPS.find(s => s.id === 'generating')!
    addBot(genStep.message)
    setStep('generating')
    setLoading(true)

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, portfolioData: parsedData }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setPortfolioSlug(data.slug)
      addBot(`Your portfolio is live! Visit it at: ${window.location.origin}/u/${data.slug}`)
      setStep('done')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      addBot(`Something went wrong: ${message}. Please try again.`)
      setStep('extras')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = BOT_STEPS.find(s => s.id === step)
  const lastMessage = messages[messages.length - 1]
  const showChoices = lastMessage?.from === 'bot' && lastMessage?.type === 'choices' && lastMessage?.choices
  const showMultiSelect = lastMessage?.from === 'bot' && lastMessage?.type === 'multiselect' && lastMessage?.choices
  const showUpload = lastMessage?.from === 'bot' && lastMessage?.type === 'upload'

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white transition text-sm">
          ← Dashboard
        </button>
        <span className="text-purple-400 font-semibold">PortfolioBot</span>
        <div className="flex gap-2">
          {(['welcome', 'style', 'background', 'projects', 'extras', 'done'] as StepId[]).map((s, i) => (
            <div key={s} className={`w-2 h-2 rounded-full ${
              s === step ? 'bg-purple-500' :
              ['welcome', 'style', 'background', 'projects', 'extras'].indexOf(s) < ['welcome', 'style', 'background', 'projects', 'extras'].indexOf(step)
                ? 'bg-purple-800' : 'bg-gray-700'
            }`} />
          ))}
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.from === 'bot'
                  ? 'bg-gray-800 text-white rounded-tl-sm'
                  : 'bg-purple-600 text-white rounded-tr-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm mr-3">🤖</div>
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {showChoices && !loading && (
          <div className="mt-4 grid gap-2">
            {lastMessage.choices!.map(c => (
              <button
                key={c.value}
                onClick={() => handleChoice(c.value, c.label)}
                className="text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 text-white px-4 py-3 rounded-xl text-sm transition"
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        {showMultiSelect && !loading && (
          <div className="mt-4">
            <div className="grid gap-2 mb-4">
              {lastMessage.choices!.map(c => (
                <button
                  key={c.value}
                  onClick={() => handleMultiSelect(c.value)}
                  className={`text-left px-4 py-3 rounded-xl text-sm border transition ${
                    selectedItems.includes(c.value)
                      ? 'bg-purple-900/40 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="mr-2">{selectedItems.includes(c.value) ? '✓' : '○'}</span>
                  {c.label}
                </button>
              ))}
            </div>
            <button
              onClick={confirmProjects}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Continue with {selectedItems.length || 'all'} project{selectedItems.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {showUpload && !loading && (
          <div className="mt-4">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-600 hover:border-purple-500 text-gray-400 hover:text-white py-8 rounded-xl transition text-sm"
            >
              Click to upload resume (PDF, DOC, TXT)
            </button>
          </div>
        )}

        {step === 'done' && portfolioSlug && (
          <div className="mt-4 bg-green-900/30 border border-green-700 rounded-xl p-4 text-center">
            <p className="text-green-400 font-semibold mb-3">Portfolio is live!</p>
            <a
              href={`/u/${portfolioSlug}`}
              target="_blank"
              className="block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition mb-2"
            >
              View my portfolio →
            </a>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Back to dashboard
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
