import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { NewsEditor } from "@/components/news/NewsEditor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function Tools() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedLogoPath, setUploadedLogoPath] = useState<string | null>(null)
  const [newsPosts, setNewsPosts] = useState<any[]>([])
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const { toast } = useToast()

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      console.log('Starting logo upload process...')
      const fileExt = file.name.split('.').pop()
      const filePath = `logo.${fileExt}`

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

      setUploadedLogoPath(publicUrl)
      
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Upload Logo</Label>
            <Input
              id="logo"
              type="file"
              onChange={handleLogoUpload}
              disabled={isUploading}
              accept="image/*"
            />
          </div>
          
          {uploadedLogoPath && (
            <div className="border rounded p-4">
              <img 
                src={uploadedLogoPath} 
                alt="Uploaded logo preview" 
                className="max-h-[100px] w-auto"
              />
            </div>
          )}
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
