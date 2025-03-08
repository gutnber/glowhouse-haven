
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Home, Settings, Users, Building2, LogIn, LogOut, Wrench, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Session } from "@supabase/supabase-js";

interface UserMenuProps {
  session: Session | null;
}

export const UserMenu = ({ session }: UserMenuProps) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out, current session:', session);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      toast({
        title: "Success",
        description: "You have been signed out"
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-2 border-primary/20 hover:bg-primary/10 transition-colors relative z-50"
          >
            {session ? (
              <User className="h-5 w-5 text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden mt-2"
          sideOffset={8}
        >
          <DropdownMenuItem asChild>
            <Link to="/" className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors duration-200">
              <Home className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('home')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/properties" className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors duration-200">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('properties')}</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-gray-200 my-1" />
              <DropdownMenuItem asChild>
                <Link to="/users" className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors duration-200">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t('users')}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tools" className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors duration-200">
                  <Wrench className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t('tools')}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {session && (
            <>
              <DropdownMenuSeparator className="bg-gray-200 my-1" />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors duration-200">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="font-medium">{t('settings')}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-gray-200 my-1" />
          <DropdownMenuItem 
            onClick={session ? handleSignOut : () => setIsAuthDialogOpen(true)} 
            className="flex items-center gap-2 px-4 py-3 hover:bg-primary/5 transition-colors duration-200 cursor-pointer"
          >
            {session ? (
              <>
                <LogOut className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('signOut')}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 text-primary" />
                <span className="font-medium">{t('signIn')}</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
    </>
  );
};
