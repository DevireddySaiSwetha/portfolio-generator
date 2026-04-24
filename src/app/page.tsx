import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-purple-400">PortfolioBot</span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-gray-400 hover:text-white px-4 py-2 transition text-sm">
            Log in
          </Link>
          <Link href="/auth/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
            Get started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <div className="inline-block bg-purple-900/40 border border-purple-700/50 text-purple-300 text-sm px-4 py-2 rounded-full mb-6">
            AI-powered portfolio generator
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Upload your resume.<br />
            <span className="text-purple-400">Get a live portfolio.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
            Chat with our bot, upload your resume, pick your style, and get a beautiful portfolio site — live in minutes, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
            >
              Build my portfolio →
            </Link>
            <Link
              href="/u/demo"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
            >
              See example
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            { icon: '📄', title: 'Upload Resume', desc: 'PDF or Word doc — our AI reads and structures everything for you' },
            { icon: '🎨', title: 'Choose Your Style', desc: 'Pick a style and background theme. AI generates a custom image for you' },
            { icon: '🔗', title: 'Get Your Link', desc: 'Share yourportfoliobot.com/u/yourname with anyone, instantly' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-sm">
        PortfolioBot — Free forever for the basics
      </footer>
    </div>
  )
}
