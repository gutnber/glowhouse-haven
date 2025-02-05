import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TemplateSelector } from "@/components/settings/TemplateSelector"
import { UITemplate } from "@/types/templates"
import { useToast } from "@/hooks/use-toast"

interface AppearanceTabProps {
  templates: UITemplate[]
  currentTemplate: string
  onApplyTemplate: (templateId: string) => Promise<void>
}

export const AppearanceTab = ({ templates, currentTemplate, onApplyTemplate }: AppearanceTabProps) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: settings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single()
      
      if (error) throw error
      return data
    }
  })

  const updateSettings = useMutation({
    mutationFn: async (featured_property_enabled: boolean) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ featured_property_enabled })
        .eq('id', settings?.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] })
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    },
    onError: (error) => {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Property</CardTitle>
          <CardDescription>
            Choose whether to show the welcome message or a featured property on the home page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="featured-property"
              checked={settings?.featured_property_enabled || false}
              onCheckedChange={(checked) => updateSettings.mutate(checked)}
            />
            <Label htmlFor="featured-property">Show featured property instead of welcome message</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Select a template for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            templates={templates}
            currentTemplate={currentTemplate}
            onApplyTemplate={onApplyTemplate}
          />
        </CardContent>
      </Card>
    </div>
  )
}