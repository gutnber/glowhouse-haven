
import { LogoSettings } from "@/components/tools/LogoSettings"
import { FooterSettingsSection } from "@/components/tools/FooterSettingsSection"
import { WebhookSettings } from "@/components/tools/WebhookSettings"
import { NewsPostsSection } from "@/components/tools/NewsPostsSection"

export default function Tools() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold">Tools</h1>
      
      <LogoSettings />
      <FooterSettingsSection />
      <WebhookSettings />
      <NewsPostsSection />
    </div>
  )
}
