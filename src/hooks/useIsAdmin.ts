
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user?.email) {
          console.log('Checking admin status for:', session.user.email)
          // Check against both admin emails
          setIsAdmin(
            session.user.email === 'help@ignishomes.com' || 
            session.user.email === 'silvia@inma.mx'
          )
        } else {
          console.log('No user email found in session')
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        console.log('Auth state changed, checking admin for:', session.user.email)
        // Check against both admin emails on auth state change as well
        setIsAdmin(
          session.user.email === 'help@ignishomes.com' ||
          session.user.email === 'silvia@inma.mx'
        )
      } else {
        setIsAdmin(false)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { isAdmin, isLoading }
}
