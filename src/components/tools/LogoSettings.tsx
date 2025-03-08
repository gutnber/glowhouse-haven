
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export function LogoSettings() {
  const [isUploading, setIsUploading] = useState(false)
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCurrentLogo = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('logo_url')
        .single()
      
      if (data?.logo_url) {
        setCurrentLogoUrl(data.logo_url)
      }
    }
    
    fetchCurrentLogo()
  }, [])

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
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
        .eq('id', (await supabase.from('app_settings').select('id').single()).data?.id)

      if (updateError) {
        console.error('Error updating app settings:', updateError)
        throw updateError
      }

      setCurrentLogoUrl(publicUrl)
      
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Logo Settings</h2>
      <div className="space-y-6">
        {currentLogoUrl && (
          <div className="space-y-2">
            <Label>Current Logo</Label>
            <div className="border rounded-lg p-4 bg-background">
              <img 
                src={currentLogoUrl} 
                alt="Current logo" 
                className="max-h-[100px] w-auto"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="logo">Upload New Logo</Label>
          <div className="flex items-center gap-4">
            <Input
              id="logo"
              type="file"
              onChange={handleLogoUpload}
              disabled={isUploading}
              accept="image/*"
              className="flex-1"
            />
            {isUploading && (
              <div className="text-sm text-muted-foreground animate-pulse">
                Uploading...
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Select a new image file from your computer to update the logo
          </p>
        </div>
      </div>
    </div>
  )
}
