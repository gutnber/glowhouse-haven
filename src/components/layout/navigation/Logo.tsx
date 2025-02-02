import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export const Logo = () => {
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder.svg")

  useEffect(() => {
    const fetchLogoUrl = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('logo_url')
        .single()
      
      if (error) {
        console.error('Error fetching logo:', error)
        return
      }
      
      if (data?.logo_url) {
        setLogoUrl(data.logo_url)
      }
    }

    fetchLogoUrl()
  }, [])

  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logoUrl} alt="Logo" className="h-13 w-auto" />
      <span className="font-semibold text-lg">Inma Soluciones Inmobiliarias</span>
    </Link>
  )
}