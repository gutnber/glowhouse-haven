import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"

export default function RootLayout() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  return (
    <div data-template={profile?.ui_template || "original"} className="min-h-screen">
      <TopNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  )
}