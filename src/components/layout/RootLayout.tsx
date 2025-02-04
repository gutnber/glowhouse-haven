import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session in RootLayout:', initialSession)
      setSession(initialSession)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed in RootLayout:', session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) throw error
      console.log('Profile data fetched:', data)
      return data
    },
    enabled: !!session?.user
  })

  return (
    <div data-template={profile?.ui_template || "original"} className="min-h-screen relative">
      <TopNavigation session={session} />
      <main className="pt-20 relative">
        <Outlet />
      </main>
    </div>
  )
}