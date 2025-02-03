import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export const Logo = () => {
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg")

  useEffect(() => {
    const fetchLogoUrl = async () => {
      console.log("Fetching logo URL...")
      const { data, error } = await supabase
        .from('app_settings')
        .select('logo_url')
        .single()
      
      if (error) {
        console.error('Error fetching logo:', error)
        return
      }
      
      if (data?.logo_url) {
        console.log("Setting new logo URL:", data.logo_url)
        setLogoUrl(data.logo_url)
      }
    }

    fetchLogoUrl()
  }, [])

  console.log("Rendering Logo component with URL:", logoUrl)
  
  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoUrl} 
        alt="Logo" 
        className="h-14 w-auto" 
        onLoad={() => console.log("Logo image loaded")}
        onError={(e) => console.error("Logo image failed to load:", e)}
      />
    </Link>
  )
}