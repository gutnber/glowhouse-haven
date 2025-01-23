import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PropertyImageUploadProps {
  onImageUploaded: (url: string) => void
}

export const PropertyImageUpload = ({ onImageUploaded }: PropertyImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      console.log('Starting file upload...')
      
      // Get the current session to check authentication
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }
      
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop()
      const filePath = `${crypto.randomUUID()}.${fileExt}`
      
      console.log('Uploading file to path:', filePath)
      
      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('File uploaded successfully')

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      console.log('Public URL generated:', publicUrl)

      onImageUploaded(publicUrl)
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id="property-image"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => document.getElementById('property-image')?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  )
}