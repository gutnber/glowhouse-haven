import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { useAuthSession } from "@/hooks/useAuthSession"

export default function RootLayout() {
  const session = useAuthSession()

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
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}