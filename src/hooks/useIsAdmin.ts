
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
        
        if (session?.user?.id) {
          console.log('Checking admin status for user ID:', session.user.id)
          
          // First check if it's one of the hardcoded admin emails for backward compatibility
          if (session.user.email === 'help@ignishomes.com' || session.user.email === 'silvia@inma.mx') {
            console.log('User has hardcoded admin email')
            setIsAdmin(true)
            setIsLoading(false)
            return
          }
          
          // Check for admin role in the database
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .single()
          
          if (roleError && roleError.code !== 'PGRST116') {
            // PGRST116 is the "no rows returned" error which is expected if user is not an admin
            console.error('Error checking role:', roleError)
            setIsAdmin(false)
          } else {
            console.log('Role data:', roleData)
            setIsAdmin(!!roleData)
          }
        } else {
          console.log('No user ID found in session')
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
      if (session?.user?.id) {
        console.log('Auth state changed, checking admin for user ID:', session.user.id)
        
        // First check if it's one of the hardcoded admin emails for backward compatibility
        if (session.user.email === 'help@ignishomes.com' || session.user.email === 'silvia@inma.mx') {
          console.log('User has hardcoded admin email')
          setIsAdmin(true)
          setIsLoading(false)
          return
        }
        
        // Check for admin role in database
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single()
          .then(({ data, error }) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error checking role on auth change:', error)
              setIsAdmin(false)
            } else {
              console.log('Role data on auth change:', data)
              setIsAdmin(!!data)
            }
            setIsLoading(false)
          })
      } else {
        setIsAdmin(false)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { isAdmin, isLoading }
}
