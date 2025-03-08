
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { FooterSettings } from "../types"

export function useFooterSettings() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [originalSettings, setOriginalSettings] = useState<FooterSettings | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchFooterSettings()
  }, [])

  const fetchFooterSettings = async () => {
    console.log('Fetching footer settings for edit form...');
    setIsLoading(true);
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .single()

    setIsLoading(false);
    if (error) {
      console.error('Error fetching footer settings:', error)
      toast({
        title: "Error",
        description: "Failed to load footer settings",
        variant: "destructive",
      })
      return
    }

    console.log('Footer settings for edit form fetched:', data);
    setSettings(data)
    setOriginalSettings(JSON.parse(JSON.stringify(data))) // Create a deep copy
  }

  const handleSettingsChange = (newSettings: FooterSettings) => {
    setSettings(newSettings)
  }

  const handleSave = async () => {
    if (!settings) return

    setIsLoading(true)
    setSaveSuccess(false)
    
    try {
      console.log('Saving footer settings:', settings);
      // Ensure we're only updating the fields we need to update
      const updateData = {
        phone: settings.phone,
        address: settings.address,
        company: settings.company,
        logo_url: settings.logo_url,
        subscribe_email: settings.subscribe_email,
        enabled: settings.enabled
      };
      
      const { error } = await supabase
        .from('footer_settings')
        .update(updateData)
        .eq('id', settings.id)

      if (error) throw error

      console.log('Footer settings updated successfully');
      
      // Update the original settings to match current settings
      setOriginalSettings(JSON.parse(JSON.stringify(settings)))
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      toast({
        title: "Success",
        description: "Footer settings updated successfully",
      })
    } catch (error) {
      console.error('Error updating footer settings:', error)
      toast({
        title: "Error",
        description: "Failed to update footer settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    settings,
    originalSettings,
    isLoading,
    saveSuccess,
    handleSettingsChange,
    handleSave
  }
}
