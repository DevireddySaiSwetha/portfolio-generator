import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BotChat from '@/components/bot/BotChat'

export default async function BotPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return <BotChat userId={user.id} />
}
