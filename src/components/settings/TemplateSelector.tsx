import { Check } from "lucide-react"
import { UITemplate } from "@/types/templates"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TemplateSelectorProps {
  templates: UITemplate[]
  selectedTemplate: string
  onSelect: (templateId: string) => void
}

export function TemplateSelector({ templates, selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "cursor-pointer transition-all hover:border-primary",
            selectedTemplate === template.id && "border-primary"
          )}
          onClick={() => onSelect(template.id)}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {template.name}
              {selectedTemplate === template.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          {template.previewImage && (
            <CardContent>
              <img
                src={template.previewImage}
                alt={`${template.name} preview`}
                className="aspect-video w-full rounded-md object-cover"
              />
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}