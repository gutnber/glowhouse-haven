import { useState, useCallback } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PropertyImageUploadProps {
  onImageUploaded: (urls: string[] | string) => void
}

export const PropertyImageUpload = ({ onImageUploaded }: PropertyImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      console.log('Starting file upload...')
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      // Upload all files in parallel
      const uploadPromises = Array.from(files).map(async (file) => {
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

        return publicUrl
      })

      const urls = await Promise.all(uploadPromises)
      onImageUploaded(urls)
      
      toast({
        title: "Success",
        description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully`,
      })
    } catch (error) {
      console.error('Error uploading images:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload(e.dataTransfer.files)
  }, [])

  return (
    <div 
      className={`flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="property-image"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
        disabled={isUploading}
      />
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-1">Upload Images</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your images here, or click to select files
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => document.getElementById('property-image')?.click()}
        className="min-w-[200px]"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </>
        )}
      </Button>
    </div>
  )
}