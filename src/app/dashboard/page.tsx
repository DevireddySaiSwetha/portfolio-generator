import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Portfolio } from '@/types/portfolio'

async function getPortfolios(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return (data ?? []) as Portfolio[]
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const portfolios = await getPortfolios(user.id)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-purple-400">PortfolioBot</span>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-gray-400 hover:text-white transition">Sign out</button>
          </form>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Portfolios</h1>
            <p className="text-gray-400 mt-1">Create and manage your AI-generated portfolios</p>
          </div>
          <Link
            href="/bot"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            + New Portfolio
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="border border-dashed border-gray-700 rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-semibold mb-2">No portfolios yet</h2>
            <p className="text-gray-400 mb-6">Upload your resume and let the bot build one for you in minutes.</p>
            <Link
              href="/bot"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition inline-block"
            >
              Create my portfolio
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {portfolios.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{p.portfolio_json?.name ?? 'My Portfolio'}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{p.portfolio_json?.title}</p>
                  {p.status === 'published' && (
                    <a
                      href={`${appUrl}/u/${p.slug}`}
                      target="_blank"
                      className="text-purple-400 text-sm hover:text-purple-300 mt-1 inline-block"
                    >
                      {appUrl}/u/{p.slug}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {p.status === 'published' && (
                    <a
                      href={`/u/${p.slug}`}
                      target="_blank"
                      className="text-sm border border-gray-700 hover:border-purple-500 px-4 py-2 rounded-lg transition"
                    >
                      Preview
                    </a>
                  )}
                  <Link
                    href={`/bot?portfolio=${p.id}`}
                    className="text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
