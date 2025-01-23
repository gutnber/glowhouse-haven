import { UploadButton } from "@/components/ui/upload-button"
import { Loader2, Upload } from "lucide-react"

interface AvatarUploaderProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function AvatarUploader({ onUpload, isUploading }: AvatarUploaderProps) {
  return (
    <UploadButton
      variant="outline"
      size="sm"
      disabled={isUploading}
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) onUpload(file)
      }}
    >
      {isUploading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      <span className="ml-2">Change Avatar</span>
    </UploadButton>
  )
}