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
  const {
    isAdmin
  } = useIsAdmin();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80'}`}>
      <div className="container mx-auto relative z-50 flex h-16 items-center justify-between px-4 my-[16px]">
        <Logo />
        <div className="flex items-center gap-4">
          {isAdmin && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary" />
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