
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileTab } from "@/components/settings/tabs/ProfileTab"
import { AppearanceTab } from "@/components/settings/tabs/AppearanceTab"
import { UITemplate } from "@/types/templates"
import { ProfileFormValues } from "@/components/settings/ProfileForm"
import { CheckCircle2 } from "lucide-react"

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
    description: "A Zillow-inspired design with vibrant orange accents",
    previewImage: "/placeholder.svg"
  }
]

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

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
        title: "Successfully Updated",
        description: "Your profile has been updated successfully",
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
        icon: <CheckCircle2 className="h-5 w-5 text-white" />,
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
        title: "Successfully Updated",
        description: "Template has been updated successfully",
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
        icon: <CheckCircle2 className="h-5 w-5 text-white" />,
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
          <ProfileTab
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            userId={profile?.id || ''}
            onAvatarChange={handleAvatarChange}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab
            templates={templates}
            currentTemplate={profile?.ui_template || 'original'}
            onApplyTemplate={(templateId) => updateTemplate.mutateAsync(templateId)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

