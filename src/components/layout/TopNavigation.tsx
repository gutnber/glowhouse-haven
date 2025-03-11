import { useEffect, useState } from "react";
import { Logo } from "./navigation/Logo";
import { UserMenu } from "./navigation/UserMenu";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Session } from "@supabase/supabase-js";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Shield } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
interface TopNavigationProps {
  session: Session | null;
}
export function TopNavigation({
  session
}: TopNavigationProps) {
  const [scrolled, setScrolled] = useState(false);
<<<<<<< HEAD
  const [loaded, setLoaded] = useState(false);
  const { isAdmin } = useIsAdmin();

=======
  const {
    isAdmin
  } = useIsAdmin();
>>>>>>> b37ce9c4b9db1b9a1e20c2d96b48ac09bf7e5a34
  useEffect(() => {
    // Set loaded to true after component mounts to trigger animation
    // Using a timeout to ensure this only happens once during initial load
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);
<<<<<<< HEAD

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 
        ${scrolled ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md shadow-lg transform-gpu' : 'bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80'}
        ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0'}
      `}
    >
      <div className="container mx-auto relative z-50 flex h-16 items-center justify-between px-4 my-[16px] text-white">
=======
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80'}`}>
      <div className="container mx-auto relative z-50 flex h-16 items-center justify-between px-4 my-[16px]">
>>>>>>> b37ce9c4b9db1b9a1e20c2d96b48ac09bf7e5a34
        <Logo />
        <div className="flex items-center gap-4">
          {isAdmin && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-orange-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 shadow-lg">
                  <p>Administrator Account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>}
          <LanguageToggle />
          <UserMenu session={session} />
        </div>
      </div>
    </nav>;
}