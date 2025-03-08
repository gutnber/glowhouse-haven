
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { LogoSettings } from "../types"

export function useLogoSettings() {
  const [logoSettings, setLogoSettings] = useState<LogoSettings | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLogoSettings()
  }, [])

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('id, logo_url')
        .single()
      
      if (error) {
        throw error
      }
      
      setLogoSettings(data)
    } catch (error) {
      console.error('Error fetching logo settings:', error)
      toast({
        title: "Error",
        description: "Failed to load logo settings",
        variant: "destructive",
      })
    }
  }

  const handleLogoUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      console.log('Starting logo upload process...')
      const fileExt = file.name.split('.').pop()
      const filePath = `logo-${Date.now()}.${fileExt}` // Add timestamp to prevent caching

      const { error: uploadError } = await supabase.storage
        .from('app-assets')
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('app-assets')
        .getPublicUrl(filePath)

      console.log('Logo uploaded successfully, public URL:', publicUrl)
      
      // Update the app_settings table with the new logo URL
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({ 
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', logoSettings?.id || '')

      if (updateError) {
        console.error('Error updating app settings:', updateError)
        throw updateError
      }

      setLogoSettings(prev => prev ? {...prev, logo_url: publicUrl} : null)
      
      toast({
        title: "Success",
        description: "Logo uploaded and saved successfully",
      })

      // Force reload the page to update the logo
      window.location.reload()
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return {
    logoSettings,
    isUploading,
    handleLogoUpload
  }
}
