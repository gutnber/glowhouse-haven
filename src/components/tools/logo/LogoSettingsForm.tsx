
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoSettings } from "./types"

interface LogoSettingsFormProps {
  logoSettings: LogoSettings
  isUploading: boolean
  onLogoUpload: (file: File) => void
}

export function LogoSettingsForm({
  logoSettings,
  isUploading,
  onLogoUpload
}: LogoSettingsFormProps) {
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    onLogoUpload(file)
  }

  return (
    <div className="space-y-6">
      {logoSettings.logo_url && (
        <div className="space-y-2">
          <Label>Current Logo</Label>
          <div className="border rounded-lg p-4 bg-background">
            <img 
              src={logoSettings.logo_url} 
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
  )
}
