import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileAvatar } from "@/components/settings/ProfileAvatar"
import { ProfileForm, ProfileFormValues } from "@/components/settings/ProfileForm"
import { TemplateSelector } from "@/components/settings/TemplateSelector"
import { UITemplate } from "@/types/templates"

const templates: UITemplate[] = [
  {
    id: "original",
    name: "Original Template",
    description: "The original layout with a clean and modern design",
    previewImage: "/placeholder.svg"
  },
  {
    id: "modern",
    name: "Modern Template",
    description: "A contemporary design with bold colors and typography",
    previewImage: "/placeholder.svg"
  },
  {
    id: "classic",
    name: "Classic Template",
    description: "Traditional layout with elegant styling",
    previewImage: "/placeholder.svg"
  }
]

// ... keep existing code (ProfileFormValues interface and other imports)

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedTemplate, setSelectedTemplate] = useState("original")

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      console.log('Profile data loaded:', data)
      return data
    }
  })

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      console.log('Updating profile with values:', values)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          avatar_url: values.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true)
    await updateProfile.mutateAsync(values)
    setIsLoading(false)
  }

  const handleAvatarChange = (url: string) => {
    if (profile) {
      handleSubmit({ ...profile, avatar_url: url })
    }
  }

  const updateTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ ui_template: templateId })
        .eq('id', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      console.error('Error updating template:', error)
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      })
    }
  })

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId)
    await updateTemplate.mutateAsync(templateId)
  }

  if (isLoadingProfile) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Loading settings...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Get the current user ID
  const getUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id
  }

  // Initialize form with profile data or empty values
  const initialValues: ProfileFormValues = profile ? {
    full_name: profile.full_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    company: profile.company || '',
    avatar_url: profile.avatar_url || '',
  } : {
    full_name: '',
    email: '',
    phone: '',
    company: '',
    avatar_url: '',
  }

  return (
    <div className="container max-w-4xl py-10">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileAvatar
                userId={profile?.id || ''}
                avatarUrl={initialValues.avatar_url}
                onAvatarChange={handleAvatarChange}
              />
              <ProfileForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelect={handleTemplateSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
