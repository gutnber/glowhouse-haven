import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { AvatarDisplay } from "./avatar/AvatarDisplay"
import { AvatarUploader } from "./avatar/AvatarUploader"

interface ProfileAvatarProps {
  userId: string
  avatarUrl?: string | null
  onAvatarChange: (url: string) => void
}

export function ProfileAvatar({ userId, avatarUrl, onAvatarChange }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadAvatar = async (file: File) => {
    try {
      setIsUploading(true)
      console.log('Starting avatar upload for user:', userId)

      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${fileExt}`

      console.log('Uploading file to path:', filePath)
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      console.log('Upload successful, getting public URL')
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log('Public URL obtained:', publicUrl)
      onAvatarChange(publicUrl)

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: "Error",
        description: "There was an error uploading your avatar.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarDisplay 
        avatarUrl={avatarUrl} 
        fallbackText={userId.slice(0, 2).toUpperCase()} 
      />
      <AvatarUploader 
        onUpload={uploadAvatar}
        isUploading={isUploading}
      />
    </div>
  )
}