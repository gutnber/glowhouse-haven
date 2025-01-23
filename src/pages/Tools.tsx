import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function Tools() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `logo.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('app-assets')
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      })
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
        <div className="space-y-2">
          <Label htmlFor="logo">Upload Logo</Label>
          <Input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Recommended size: 32x32px. Supported formats: PNG, JPG, SVG
          </p>
        </div>
      </div>
    </div>
  )
}