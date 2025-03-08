
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, MapPin, Phone, Mail, Home, ArrowRight } from "lucide-react";

interface FooterSettings {
  phone: string | null;
  address: string | null;
  company: string | null;
  logo_url: string | null;
  subscribe_email: string | null;
  enabled: boolean;
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    const { data, error } = await supabase.from('footer_settings').select('*').single();
    if (error) {
      console.error('Error fetching footer settings:', error);
      return;
    }

    // Merge default values with database settings
    setSettings({
      ...data,
      phone: "+52 664 484 2251",
      address: "Calle 10ma. esq. Sirak Baloyan 8779-206 Zona Centro, C.P. 22000, Tijuana, B.C.",
      company: data.company || "Inma Soluciones Inmobiliarias",
      logo_url: data.logo_url || "https://inma.pro/static/images/logo.svg"
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save the subscriber to the database
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') {
          // Unique violation - email already exists
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter."
          });
        } else {
          console.error('Error subscribing:', error);
          toast({
            title: "Error",
            description: "Failed to subscribe. Please try again later.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Thank you for subscribing to our newsletter!"
        });

        // Show success state
        setIsSuccess(true);

        // Reset after delay
        setTimeout(() => {
          setEmail("");
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error in subscribe function:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!settings?.enabled) {
    return null;
  }

  return (
    <footer className="mt-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto py-12 px-4">
        {/* Top section with logo and company info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="space-y-4">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt={settings.company || "Company Logo"} 
                className="h-16 object-contain" 
              />
            ) : (
              <h2 className="text-2xl font-bold text-primary">{settings.company}</h2>
            )}
            <p className="text-gray-300 text-sm max-w-xs">
              We specialize in helping you find your dream property with professional service and local expertise.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary-foreground border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </a>
              </li>
              <li>
                <a href="/properties" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="group-hover:translate-x-1 transition-transform">Properties</span>
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white flex items-center gap-2 group">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary-foreground border-b border-gray-700 pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{settings.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-gray-300 hover:text-white text-sm">
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter signup form */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300 mb-6">Stay updated with our latest properties and real estate news</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Input 
                  type="email" 
                  placeholder={settings.subscribe_email || "Enter your email"} 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                  disabled={isSubmitting || isSuccess} 
                />
              </div>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={isSubmitting || isSuccess || !email}
              >
                {isSuccess ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-10 pt-6 border-t border-gray-800">
          <p>© {new Date().getFullYear()} {settings.company}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
