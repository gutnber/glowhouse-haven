import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function Tools() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedLogoPath, setUploadedLogoPath] = useState<string | null>(null)
  const { toast } = useToast()

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      console.log('Starting logo upload process...')
      const fileExt = file.name.split('.').pop()
      const filePath = `logo.${fileExt}`

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

      setUploadedLogoPath(publicUrl)
      
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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Tools</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Logo Settings</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              id="logo"
              type="file"
              onChange={handleLogoUpload}
              disabled={isUploading}
              accept="image/*"
            />
          </div>
          
          {uploadedLogoPath && (
            <div className="border rounded p-4">
              <img 
                src={uploadedLogoPath} 
                alt="Uploaded logo preview" 
                className="max-h-[100px] w-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}