
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Home, Settings, Users, Building2, LogIn, LogOut, Wrench, Menu, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Session } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  session: Session | null;
}

export const UserMenu = ({ session }: UserMenuProps) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (session?.user) {
      // Fetch user profile to get avatar URL
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single();
          
        if (data && !error) {
          setAvatarUrl(data.avatar_url);
        }
      };
      
      fetchProfile();
    } else {
      setAvatarUrl(null);
    }
  }, [session]);

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

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
              avatarUrl ? (
                <Avatar className="h-5 w-5">
                  <AvatarImage src={avatarUrl} alt="User avatar" />
                  <AvatarFallback className="text-xs">
                    {session.user?.email?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5 text-primary" />
              )
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-gray-900 border border-gray-700 shadow-lg rounded-xl overflow-hidden mt-2"
          sideOffset={8}
        >
          <DropdownMenuItem asChild>
            <Link to="/" className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 group">
              <Home className="h-4 w-4 text-orange-400" />
              <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('home'))}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/properties" className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 group">
              <Building2 className="h-4 w-4 text-orange-400" />
              <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('properties'))}</span>
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-gray-700 my-1" />
              <DropdownMenuItem asChild>
                <Link to="/users" className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 group">
                  <Users className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('users'))}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tools" className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 group">
                  <Wrench className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('tools'))}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/communications" className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 group">
                  <MessageSquare className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('communications'))}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {session && (
            <>
              <DropdownMenuSeparator className="bg-gray-700 my-1" />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 group">
                  <Settings className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('settings'))}</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-gray-200 my-1" />
          <DropdownMenuItem 
            onClick={session ? handleSignOut : () => setIsAuthDialogOpen(true)} 
            className="flex items-center gap-2 px-4 py-3 hover:bg-orange-500/20 transition-colors duration-200 cursor-pointer group"
          >
            {session ? (
              <>
                <LogOut className="h-4 w-4 text-orange-400" />
                <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('signOut'))}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 text-orange-400" />
                <span className="font-medium text-white group-hover:text-black">{capitalizeFirstLetter(t('signIn'))}</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
    </>
  );
};
