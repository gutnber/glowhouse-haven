import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { NewsEditor } from "@/components/news/NewsEditor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Plus, Upload, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function Tools() {
  const [isUploading, setIsUploading] = useState(false)
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null)
  const [newsPosts, setNewsPosts] = useState<any[]>([])
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [copiedProperty, setCopiedProperty] = useState(false)
  const [copiedNews, setCopiedNews] = useState(false)
  const { toast } = useToast()

  const webhookBaseUrl = "https://xqghledkjaojfpijpjhn.supabase.co/functions/v1/webhook-handler"

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

  useEffect(() => {
    const fetchCurrentLogo = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('logo_url')
        .single()
      
      if (data?.logo_url) {
        setCurrentLogoUrl(data.logo_url)
      }
    }
    
    fetchCurrentLogo()
  }, [])

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      console.log('Starting logo upload process...')
      const fileExt = file.name.split('.').pop()
      const filePath = `logo-${Date.now()}.${fileExt}` // Add timestamp to prevent caching

      const { error: uploadError } = await supabase.storage
        .from('app-assets')
        .upload(filePath, file, {
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('app-assets')
        .getPublicUrl(filePath)

      console.log('Logo uploaded successfully, public URL:', publicUrl)
      
      // Update the app_settings table with the new logo URL
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({ 
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('app_settings').select('id').single()).data?.id)

      if (updateError) {
        console.error('Error updating app settings:', updateError)
        throw updateError
      }

      setCurrentLogoUrl(publicUrl)
      
      toast({
        title: "Success",
        description: "Logo uploaded and saved successfully",
      })

      // Force reload the page to update the logo
      window.location.reload()
    } catch (error) {
      console.error('Error uploading logo:', error)
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    fetchNewsPosts()
  }, [])

  const fetchNewsPosts = async () => {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return
    }

    setNewsPosts(data || [])
  }

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', postId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Post deleted successfully",
    })
    fetchNewsPosts()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Tools</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Logo Settings</h2>
        <div className="space-y-6">
          {currentLogoUrl && (
            <div className="space-y-2">
              <Label>Current Logo</Label>
              <div className="border rounded-lg p-4 bg-background">
                <img 
                  src={currentLogoUrl} 
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
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Webhooks</h2>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Upload Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this webhook URL in Zapier or other automation tools to automatically add new properties.
              </p>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>News Post Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this webhook URL in Zapier or other automation tools to automatically add news posts.
              </p>
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
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">News Posts</h2>
          <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <NewsEditor
                onSave={() => {
                  setIsCreatingPost(false)
                  fetchNewsPosts()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {newsPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <NewsEditor
                          initialData={post}
                          onSave={() => {
                            setEditingPost(null)
                            fetchNewsPosts()
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                {post.feature_image_url && (
                  <img
                    src={post.feature_image_url}
                    alt={post.title}
                    className="mt-2 max-h-[100px] object-cover rounded-lg"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
