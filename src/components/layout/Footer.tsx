
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, CheckCircle } from "lucide-react"

interface FooterSettings {
  phone: string | null
  address: string | null
  company: string | null
  logo_url: string | null
  subscribe_email: string | null
  enabled: boolean
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchFooterSettings()
  }, [])

  const fetchFooterSettings = async () => {
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching footer settings:', error)
      return
    }

    // Merge default values with database settings
    setSettings({
      ...data,
      phone: "+52 664 484 2251",
      address: "Calle 10ma. esq. Sirak Baloyan 8779-206 Zona Centro, C.P. 22000, Tijuana, B.C.",
      company: data.company || "Inma Soluciones Inmobiliarias",
      logo_url: data.logo_url || "https://inma.pro/static/images/logo.svg"
    })
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save the subscriber to the database
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') {
          // Unique violation - email already exists
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          })
        } else {
          console.error('Error subscribing:', error)
          toast({
            title: "Error",
            description: "Failed to subscribe. Please try again later.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Success",
          description: "Thank you for subscribing to our newsletter!",
        })
        
        // Show success state
        setIsSuccess(true)
        
        // Reset after delay
        setTimeout(() => {
          setEmail("")
          setIsSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error in subscribe function:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!settings?.enabled) {
    return null
  }

  return (
    <footer className="mt-auto bg-gradient-to-r from-gray-300/70 via-gray-100/70 to-gray-300/70 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {(settings.logo_url || settings.company) && (
              <div className="h-12">
                {settings.logo_url ? (
                  <img 
                    src={settings.logo_url} 
                    alt={settings.company || 'Company logo'} 
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{settings.company}</h3>
                )}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-sm">
              Phone: <a href="tel:+526644842251" className="hover:text-primary">+52 664 484 2251</a>
            </p>
            <p className="text-sm">
              Address: Calle 10ma. esq. Sirak Baloyan 8779-206 Zona Centro, C.P. 22000, Tijuana, B.C.
            </p>
          </div>

          {/* Subscribe Form */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={settings.subscribe_email || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm"
                disabled={isSubmitting || isSuccess}
              />
              <Button type="submit" disabled={isSubmitting || isSuccess || !email}>
                {isSuccess ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
