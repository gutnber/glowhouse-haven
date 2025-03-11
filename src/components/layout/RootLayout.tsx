
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { useAuthSession } from "@/hooks/useAuthSession"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { useState, useEffect } from "react"

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const session = useAuthSession()

  const { data: profile, isLoading: profileLoading } = useQuery({
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

  useEffect(() => {
    // Mark content as loaded when profile data is ready
    if (!session?.user || (!profileLoading && profile !== undefined)) {
      setContentLoaded(true);
    }
  }, [session, profile, profileLoading]);

  useEffect(() => {
    // Only hide loading screen when content is loaded
    if (contentLoaded) {
      // Add a slight delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800); // Increased delay for smoother transition
      
      return () => clearTimeout(timer);
    }
  }, [contentLoaded]);

  return (
    <div 
      data-template={profile?.ui_template || "original"} 
      className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground"
    >
      {loading && <LoadingScreen />}
      <TopNavigation session={session} />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
