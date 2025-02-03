import { LanguageToggle } from "@/components/LanguageToggle"
import { Logo } from "./navigation/Logo"
import { UserMenu } from "./navigation/UserMenu"

export const TopNavigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border -translate-y-[50px] transition-transform hover:translate-y-0">
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