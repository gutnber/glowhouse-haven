import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplateSelector } from "@/components/settings/TemplateSelector"
import { Button } from "@/components/ui/button"
import { UITemplate } from "@/types/templates"
import { Loader2 } from "lucide-react"

interface AppearanceTabProps {
  templates: UITemplate[]
  currentTemplate: string
  onApplyTemplate: (templateId: string) => Promise<void>
}

export function AppearanceTab({ 
  templates, 
  currentTemplate,
  onApplyTemplate 
}: AppearanceTabProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate)
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (selectedTemplate === currentTemplate) return
    setIsApplying(true)
    try {
      await onApplyTemplate(selectedTemplate)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
        <div className="flex justify-end">
          <Button 
            onClick={handleApply}
            disabled={isApplying || selectedTemplate === currentTemplate}
          >
            {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}