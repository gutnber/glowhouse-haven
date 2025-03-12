
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Outlet, useLocation } from "react-router-dom"
import { TopNavigation } from "./TopNavigation"
import { Footer } from "./Footer"
import { useAuthSession } from "@/hooks/useAuthSession"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { useState, useEffect } from "react"
import { SEO } from "@/components/SEO"
import { ChatAssistantProvider } from "@/contexts/ChatAssistantContext"
import { ChatBubble } from "@/components/assistant/ChatBubble"

const MINIMUM_LOADING_TIME = 5000; // 5 seconds for initial load/refresh

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const session = useAuthSession();
  const location = useLocation();

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
  });

  useEffect(() => {
    // Remove loading screen immediately if no user session
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const startTime = Date.now();
    
    // Show loading on route changes and ensure minimum duration
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);
      
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }, 400);
    
    return () => clearTimeout(timer);
  }, [session, location.pathname]);

  return (
    <>
      <div 
        data-template={profile?.ui_template || "original"} 
        className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground"
      >
        <SEO />
        {loading && <LoadingScreen />}
        <TopNavigation session={session} />
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatAssistantProvider>
        <ChatBubble />
      </ChatAssistantProvider>
    </>
  );
}
