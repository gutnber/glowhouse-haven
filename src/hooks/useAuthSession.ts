import { useState, useEffect } from "react"
import { Session } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Clear any stale tokens on mount
    localStorage.removeItem('sb-xqghledkjaojfpijpjhn-auth-token')

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session:', initialSession)
      if (initialSession) {
        setSession(initialSession)
      } else {
        console.log('No initial session found')
        setSession(null)
        navigate('/')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', { event, session: currentSession })
      
      switch (event) {
        case 'SIGNED_OUT':
          console.log('User signed out, clearing session')
          setSession(null)
          // Clear stored tokens
          localStorage.removeItem('sb-xqghledkjaojfpijpjhn-auth-token')
          navigate('/')
          break
          
        case 'SIGNED_IN':
          console.log('User signed in, setting session')
          if (currentSession) {
            setSession(currentSession)
          }
          break
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed, updating session')
          if (currentSession) {
            setSession(currentSession)
          }
          break
          
        case 'INITIAL_SESSION':
          if (!currentSession) {
            console.log('No initial session, clearing data')
            setSession(null)
            localStorage.removeItem('sb-xqghledkjaojfpijpjhn-auth-token')
            navigate('/')
          }
          break
          
        default:
          if (currentSession) {
            setSession(currentSession)
          } else {
            setSession(null)
          }
      }
    })

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [navigate])

  return session
}