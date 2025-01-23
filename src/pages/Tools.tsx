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
      setUploadedLogoPath(publicUrl)
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully. Click Apply to update the display.",
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

  const handleApplyLogo = () => {
    if (!uploadedLogoPath) return
    
    // Find the sidebar logo image and update its src
    const sidebarLogo = document.querySelector('.sidebar-header img') as HTMLImageElement
    if (sidebarLogo) {
      sidebarLogo.src = uploadedLogoPath
      console.log('Logo updated in sidebar:', uploadedLogoPath)
      
      toast({
        title: "Success",
        description: "Logo has been updated",
      })
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
            />
          </div>
          
          {uploadedLogoPath && (
            <div className="space-y-4">
              <div className="border rounded p-4">
                <img 
                  src={uploadedLogoPath} 
                  alt="Uploaded logo preview" 
                  className="max-h-[100px] w-auto"
                />
              </div>
              <Button 
                onClick={handleApplyLogo}
                disabled={isUploading}
              >
                Apply Logo
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}