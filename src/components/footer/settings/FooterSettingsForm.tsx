
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { FooterSettings } from "../types"

interface FooterSettingsFormProps {
  settings: FooterSettings
  originalSettings: FooterSettings | null
  isLoading: boolean
  saveSuccess: boolean
  onSettingsChange: (settings: FooterSettings) => void
  onSave: () => void
}

export function FooterSettingsForm({
  settings,
  originalSettings,
  isLoading,
  saveSuccess,
  onSettingsChange,
  onSave
}: FooterSettingsFormProps) {
  
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="footer-enabled">Enable Footer</Label>
        <Switch
          id="footer-enabled"
          checked={settings.enabled}
          onCheckedChange={(checked) => 
            onSettingsChange({ ...settings, enabled: checked })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          value={settings.company || ''}
          onChange={(e) => 
            onSettingsChange({ ...settings, company: e.target.value })
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
            onSettingsChange({ ...settings, phone: e.target.value })
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
            onSettingsChange({ ...settings, address: e.target.value })
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
            onSettingsChange({ ...settings, logo_url: e.target.value })
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
            onSettingsChange({ ...settings, subscribe_email: e.target.value })
          }
          placeholder="Enter subscribe email"
        />
      </div>

      <Button 
        onClick={onSave} 
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
    </div>
  )
}
