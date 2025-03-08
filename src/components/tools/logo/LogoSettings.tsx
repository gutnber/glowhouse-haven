
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoSettingsLoader } from "./LogoSettingsLoader"
import { LogoSettingsForm } from "./LogoSettingsForm"
import { useLogoSettings } from "./hooks/useLogoSettings"

export function LogoSettings() {
  const {
    logoSettings,
    isUploading,
    handleLogoUpload
  } = useLogoSettings()

  if (!logoSettings) {
    return <LogoSettingsLoader />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <LogoSettingsForm
          logoSettings={logoSettings}
          isUploading={isUploading}
          onLogoUpload={handleLogoUpload}
        />
      </CardContent>
    </Card>
  )
}
