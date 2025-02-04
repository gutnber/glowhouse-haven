import { useEffect, useState } from "react"
import { Logo } from "./navigation/Logo"
import { UserMenu } from "./navigation/UserMenu"
import { LanguageToggle } from "@/components/LanguageToggle"
import { Session } from "@supabase/supabase-js"

interface TopNavigationProps {
  session: Session | null
}

export function TopNavigation({ session }: TopNavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled 
          ? 'bg-gradient-to-r from-gray-300/70 via-gray-100/70 to-gray-300/70 backdrop-blur-lg shadow-sm' 
          : 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300'
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Logo />
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <UserMenu session={session} />
        </div>
      </div>
    </nav>
  )
}