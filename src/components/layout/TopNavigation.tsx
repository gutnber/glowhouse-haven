import { LanguageToggle } from "@/components/LanguageToggle"
import { Logo } from "./navigation/Logo"
import { UserMenu } from "./navigation/UserMenu"
import { useEffect, useState } from "react"

export const TopNavigation = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-200 ${
      scrolled ? 'bg-background/60 backdrop-blur-lg' : 'bg-background/80 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}