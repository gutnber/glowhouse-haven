import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PropertyImageUpload } from "@/components/property/PropertyImageUpload"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NewsEditorProps {
  onSave?: () => void
  initialData?: {
    id?: string
    title?: string
    content?: string
    feature_image_url?: string
  }
}

export const NewsEditor = ({ onSave, initialData }: NewsEditorProps) => {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [featureImage, setFeatureImage] = useState(initialData?.feature_image_url || "")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const postData = {
        title,
        content,
        feature_image_url: featureImage,
        updated_at: new Date().toISOString(),
      }

      if (initialData?.id) {
        await supabase
          .from('news_posts')
          .update(postData)
          .eq('id', initialData.id)
      } else {
        await supabase
          .from('news_posts')
          .insert([postData])
      }

      toast({
        title: "Success",
        description: `Post ${initialData?.id ? 'updated' : 'created'} successfully`,
      })
      
      if (onSave) onSave()
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit" : "Create"} News Post</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Feature Image</Label>
            <PropertyImageUpload
              onImageUploaded={(urls) => {
                const url = Array.isArray(urls) ? urls[0] : urls
                setFeatureImage(url)
              }}
            />
            {featureImage && (
              <img
                src={featureImage}
                alt="Feature"
                className="mt-2 max-h-[200px] object-cover rounded-lg"
              />
            )}
          </div>
        </CardContent>
      </ScrollArea>
      <CardFooter className="border-t pt-4 mt-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="ml-auto"
        >
          {isSaving ? "Saving..." : "Save Post"}
        </Button>
      </CardFooter>
    </Card>
  )
}