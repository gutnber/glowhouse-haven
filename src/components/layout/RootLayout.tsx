
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { useAuthSession } from "@/hooks/useAuthSession"

export default function RootLayout() {
  const session = useAuthSession()

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No session, skipping profile fetch')
        return null
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        if (error) {
          console.error('Error fetching profile:', error)
          throw error
        }
        
        console.log('Profile data fetched:', data)
        return data
      } catch (error) {
        console.error('Error in profile query:', error)
        throw error
      }
    },
    enabled: !!session?.user,
    retry: 1
  })

  return (
    <div 
      data-template={profile?.ui_template || "original"} 
      className="min-h-screen flex flex-col pointer-events-auto overflow-x-hidden"
    >
      <TopNavigation session={session} />
      <main className="flex-1 pointer-events-auto pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
