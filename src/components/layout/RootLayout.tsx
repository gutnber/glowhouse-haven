import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet, useNavigate } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session in RootLayout:', initialSession)
      setSession(initialSession)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed in RootLayout:', { event, session: currentSession })
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing session')
        setSession(null)
        navigate('/')
        return
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in, updating session')
        setSession(currentSession)
        return
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, updating session')
        setSession(currentSession)
        return
      }

      // Handle session expired
      if (event === 'INITIAL_SESSION' && !currentSession) {
        console.log('No initial session, redirecting to home')
        setSession(null)
        navigate('/')
        return
      }

      setSession(currentSession)
    })

    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [navigate])

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