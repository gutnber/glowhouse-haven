
import { Link } from "react-router-dom";
import { Home, Building, Newspaper, Users, MailPlus, Inbox } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Logo() {
  const { isAdmin } = useIsAdmin();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('app_settings')
          .select('logo_url')
          .single();
        
        if (error) {
          console.error('Error fetching logo:', error);
          return;
        }
        
        setLogoUrl(data?.logo_url || null);
      } catch (error) {
        console.error('Error fetching logo:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogo();
  }, []);
  
  return (
    <div className="flex items-center gap-4">
      <Link to="/" className="flex items-center text-xl font-bold text-primary">
        {!isLoading && logoUrl ? (
          <img src={logoUrl} alt="Company Logo" className="h-10 max-w-[150px] object-contain" />
        ) : (
          <span>Real Estate</span>
        )}
      </Link>
      <nav className="hidden md:flex items-center gap-4">
        <Link to="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link to="/properties" className="flex items-center gap-1 hover:text-primary">
          <Building className="h-4 w-4" />
          <span>Properties</span>
        </Link>
        <Link to="/news" className="flex items-center gap-1 hover:text-primary">
          <Newspaper className="h-4 w-4" />
          <span>News</span>
        </Link>
        <Link to="/contact" className="flex items-center gap-1 hover:text-primary">
          <MailPlus className="h-4 w-4" />
          <span>Contact</span>
        </Link>
        {isAdmin && (
          <Link to="/users" className="flex items-center gap-1 hover:text-primary">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin/communications" className="flex items-center gap-1 hover:text-primary">
            <Inbox className="h-4 w-4" />
            <span>Communications</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
