import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsAdmin(session?.user?.email === 'help@ignishomes.com')
      } catch (error) {
        console.error('Error checking admin status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(session?.user?.email === 'help@ignishomes.com')
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { isAdmin, isLoading }
}