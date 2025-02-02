import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Home, Settings, Users, Building2, LogIn, LogOut, Wrench, Menu } from "lucide-react"
import { AuthDialog } from "@/components/auth/AuthDialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/LanguageToggle"

export const TopNavigation = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg")
  const { toast } = useToast()
  const navigate = useNavigate()
  const { isAdmin } = useIsAdmin()
  const { t } = useLanguage()

  // Fetch the current session on mount and listen for auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch logo URL from app_settings
  useEffect(() => {
    const fetchLogoUrl = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('logo_url')
        .single()
      
      if (error) {
        console.error('Error fetching logo:', error)
        return
      }
      
      if (data?.logo_url) {
        setLogoUrl(data.logo_url)
      }
    }

    fetchLogoUrl()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Success",
        description: "You have been signed out",
      })
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
              <span className="font-semibold text-lg">{t('propertyManagement')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>{t('home')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/properties" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{t('properties')}</span>
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{t('users')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tools" className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        <span>{t('tools')}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {session && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>{t('settings')}</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={session ? handleSignOut : () => setIsAuthDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  {session ? (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>{t('signOut')}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>{t('signIn')}</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </nav>
  )
}