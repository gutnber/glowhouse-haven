
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FooterSettingsLoader } from "./settings/FooterSettingsLoader"
import { FooterSettingsForm } from "./settings/FooterSettingsForm"
import { useFooterSettings } from "./hooks/useFooterSettings"

export function FooterSettings() {
  const {
    settings,
    originalSettings,
    isLoading,
    saveSuccess,
    handleSettingsChange,
    handleSave
  } = useFooterSettings()

  if (!settings) {
    return <FooterSettingsLoader />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FooterSettingsForm
          settings={settings}
          originalSettings={originalSettings}
          isLoading={isLoading}
          saveSuccess={saveSuccess}
          onSettingsChange={handleSettingsChange}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}
