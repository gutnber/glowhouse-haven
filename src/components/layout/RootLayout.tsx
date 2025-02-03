import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { useEffect } from "react"

export default function RootLayout() {
  const { data: profile, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log('Fetching profile data...')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      console.log('Profile data fetched:', data)
      return data
    }
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed, refetching profile...')
      refetch()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refetch])

  return (
    <div data-template={profile?.ui_template || "original"} className="min-h-screen">
      <TopNavigation />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  )
}