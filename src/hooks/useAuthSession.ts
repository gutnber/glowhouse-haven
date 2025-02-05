import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session:', initialSession)
      setSession(initialSession)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', { event, session: currentSession })
      
      switch (event) {
        case 'SIGNED_OUT':
          console.log('User signed out')
          setSession(null)
          // Clear any stored tokens
          localStorage.removeItem('supabase.auth.token')
          navigate('/')
          break
          
        case 'SIGNED_IN':
          console.log('User signed in')
          setSession(currentSession)
          break
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed')
          setSession(currentSession)
          break
          
        case 'INITIAL_SESSION':
          if (!currentSession) {
            console.log('No initial session')
            setSession(null)
            // Clear any stored tokens
            localStorage.removeItem('supabase.auth.token')
            navigate('/')
          }
          break
          
        default:
          setSession(currentSession)
      }
    })

    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [navigate])

  return session
}