import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileAvatar } from "@/components/settings/ProfileAvatar"
import { ProfileForm, ProfileFormValues } from "@/components/settings/ProfileForm"

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch profile data
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

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Loading profile information...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
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
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your profile information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileAvatar
            avatarUrl={initialValues.avatar_url}
            fullName={initialValues.full_name}
            onAvatarChange={handleAvatarChange}
          />
          <ProfileForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}