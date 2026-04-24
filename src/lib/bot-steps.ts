export type StepId =
  | 'welcome'
  | 'resume'
  | 'style'
  | 'background'
  | 'projects'
  | 'extras'
  | 'generating'
  | 'done'

export interface BotStep {
  id: StepId
  message: string
  type: 'text' | 'upload' | 'choices' | 'multiselect' | 'confirm'
  choices?: { label: string; value: string }[]
}

export const BOT_STEPS: BotStep[] = [
  {
    id: 'welcome',
    message: "Hi! I'm PortfolioBot. I'll build a beautiful portfolio for you in a few minutes. Let's start — upload your resume (PDF).",
    type: 'upload',
  },
  {
    id: 'style',
    message: "Great, I've read your resume! Now, what's your preferred portfolio style?",
    type: 'choices',
    choices: [
      { label: 'Minimal — clean and simple', value: 'minimal' },
      { label: 'Techy — monospace, developer vibe', value: 'techy' },
      { label: 'Creative — colorful and bold', value: 'creative' },
      { label: 'Bold — strong, high-contrast', value: 'bold' },
    ],
  },
  {
    id: 'background',
    message: "Nice choice! What kind of background should your portfolio have?",
    type: 'choices',
    choices: [
      { label: 'Space & Stars — dark cosmos', value: 'space' },
      { label: 'Geometric Mesh — 3D wireframe', value: 'geometric' },
      { label: 'Gradient Waves — smooth and fluid', value: 'waves' },
      { label: 'Abstract 3D — floating particles', value: 'abstract' },
    ],
  },
  {
    id: 'projects',
    message: "Here are the projects I found in your resume. Which ones do you want to highlight? (I'll show them as cards on your portfolio)",
    type: 'multiselect',
    choices: [],
  },
  {
    id: 'extras',
    message: "Almost there! Do you want any extra sections?",
    type: 'choices',
    choices: [
      { label: 'No extras, keep it focused', value: 'none' },
      { label: 'Add Certifications section', value: 'certifications' },
      { label: 'Add Awards section', value: 'awards' },
      { label: 'Add Blog/Writing section', value: 'blog' },
    ],
  },
  {
    id: 'generating',
    message: "Perfect! I'm generating your portfolio now — parsing your data, creating your background image, and assembling everything...",
    type: 'confirm',
  },
  {
    id: 'done',
    message: "Your portfolio is live! Here's your link:",
    type: 'text',
  },
]
