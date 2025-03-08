
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface FooterSettings {
  id: string
  phone: string | null
  address: string | null
  company: string | null
  logo_url: string | null
  subscribe_email: string | null
  enabled: boolean
}

export function FooterSettings() {
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
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching footer settings:', error)
      return
    }

    console.log('Footer settings for edit form fetched:', data);
    setSettings(data)
    setOriginalSettings(JSON.parse(JSON.stringify(data))) // Create a deep copy
  }

  const hasChanges = () => {
    if (!settings || !originalSettings) return false
    
    return (
      settings.phone !== originalSettings.phone ||
      settings.address !== originalSettings.address ||
      settings.company !== originalSettings.company ||
      settings.logo_url !== originalSettings.logo_url ||
      settings.subscribe_email !== originalSettings.subscribe_email ||
      settings.enabled !== originalSettings.enabled
    )
  }

  const handleSave = async () => {
    if (!settings) return

    setIsLoading(true)
    setSaveSuccess(false)
    
    try {
      console.log('Saving footer settings:', settings);
      const { error } = await supabase
        .from('footer_settings')
        .update({
          phone: settings.phone,
          address: settings.address,
          company: settings.company,
          logo_url: settings.logo_url,
          subscribe_email: settings.subscribe_email,
          enabled: settings.enabled
        })
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

  if (!settings) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="footer-enabled">Enable Footer</Label>
          <Switch
            id="footer-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => 
              setSettings(prev => prev ? { ...prev, enabled: checked } : null)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            value={settings.company || ''}
            onChange={(e) => 
              setSettings(prev => prev ? { ...prev, company: e.target.value } : null)
            }
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={settings.phone || ''}
            onChange={(e) => 
              setSettings(prev => prev ? { ...prev, phone: e.target.value } : null)
            }
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={settings.address || ''}
            onChange={(e) => 
              setSettings(prev => prev ? { ...prev, address: e.target.value } : null)
            }
            placeholder="Enter address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-url">Logo URL</Label>
          <Input
            id="logo-url"
            value={settings.logo_url || ''}
            onChange={(e) => 
              setSettings(prev => prev ? { ...prev, logo_url: e.target.value } : null)
            }
            placeholder="Enter logo URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscribe-email">Subscribe Email</Label>
          <Input
            id="subscribe-email"
            value={settings.subscribe_email || ''}
            onChange={(e) => 
              setSettings(prev => prev ? { ...prev, subscribe_email: e.target.value } : null)
            }
            placeholder="Enter subscribe email"
          />
        </div>

        <Button 
          onClick={handleSave} 
          disabled={isLoading || !hasChanges()}
          className="relative"
        >
          {saveSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-md">
              <Check className="text-white h-5 w-5" />
            </div>
          )}
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
