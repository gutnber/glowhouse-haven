
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Copy } from "lucide-react"

export function WebhookSettings() {
  const [copiedProperty, setCopiedProperty] = useState(false)
  const [copiedNews, setCopiedNews] = useState(false)
  const { toast } = useToast()

  const webhookBaseUrl = "https://xqghledkjaojfpijpjhn.supabase.co/functions/v1/webhook-handler"

  const propertyPayloadExample = {
    name: "Beautiful Family Home",
    address: "123 Main St, City, State",
    description: "A wonderful family home with modern amenities",
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    build_year: 2020,
    features: ["Garage", "Pool", "Garden"],
    property_type: "singleFamily",
    mode: "sale",
    status: "available",
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  }

  const newsPayloadExample = {
    title: "New Property Listed in Downtown",
    content: "We're excited to announce a new property listing in the heart of downtown...",
    feature_image_url: "https://example.com/news-image.jpg"
  }

  const copyWebhookUrl = async (type: 'property' | 'news') => {
    const webhookUrl = `${webhookBaseUrl}?type=${type}`
    try {
      await navigator.clipboard.writeText(webhookUrl)
      if (type === 'property') {
        setCopiedProperty(true)
        setTimeout(() => setCopiedProperty(false), 2000)
      } else {
        setCopiedNews(true)
        setTimeout(() => setCopiedNews(false), 2000)
      }
      toast({
        title: "Copied!",
        description: "Webhook URL has been copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy webhook URL",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Webhooks</h2>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Property Upload Webhook</CardTitle>
            <CardDescription>
              Use this webhook URL in Zapier or other automation tools to automatically add new properties.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={`${webhookBaseUrl}?type=property`}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyWebhookUrl('property')}
              >
                <Copy className={copiedProperty ? "text-green-500" : ""} />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Example Payload</Label>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(propertyPayloadExample, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News Post Webhook</CardTitle>
            <CardDescription>
              Use this webhook URL in Zapier or other automation tools to automatically add news posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={`${webhookBaseUrl}?type=news`}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyWebhookUrl('news')}
              >
                <Copy className={copiedNews ? "text-green-500" : ""} />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Example Payload</Label>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(newsPayloadExample, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
