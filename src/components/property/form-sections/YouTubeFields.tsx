
import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/LanguageContext"

interface YouTubeFieldsProps {
  form: UseFormReturn<any>
}

export const YouTubeFields = ({ form }: YouTubeFieldsProps) => {
  console.log('YouTube form values:', form.getValues())
  const { t } = useLanguage()
  
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('property.video.settings')}</h3>
        <FormField
          control={form.control}
          name="youtube_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-500">{t('property.video.url')}</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="Paste YouTube video URL (e.g., https://youtu.be/...)"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>Add a YouTube video to showcase the property</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <FormField
            control={form.control}
            name="youtube_autoplay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-orange-500">{t('property.video.autoplay')}</FormLabel>
                  <FormDescription>
                    Automatically start playing the video
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube_muted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-orange-500">{t('property.video.muted')}</FormLabel>
                  <FormDescription>
                    Start video without sound
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube_controls"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-orange-500">{t('property.video.controls')}</FormLabel>
                  <FormDescription>
                    Display video player controls
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('property.visualEffects')}</h3>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="enable_border_beam"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-orange-500">{t('property.borderBeam')}</FormLabel>
                  <FormDescription>
                    Enable animated border effect on property cards
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  )
}
