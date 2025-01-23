import { useState } from "react"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/integrations/supabase/client"

interface ProfileAvatarProps {
  avatarUrl: string
  fullName: string
  onAvatarChange: (url: string) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function ProfileAvatar({ avatarUrl, fullName, onAvatarChange }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const filePath = `${session.user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onAvatarChange(publicUrl)
      
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {fullName?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('avatar')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Change Picture"}
          </Button>
          <p className="text-sm text-muted-foreground mt-1">
            Maximum file size: 5MB
          </p>
        </div>
      </div>
    </div>
  )
}