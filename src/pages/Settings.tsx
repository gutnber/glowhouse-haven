import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileAvatar } from "@/components/settings/ProfileAvatar"
import { ProfileForm, ProfileFormValues } from "@/components/settings/ProfileForm"

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileFormValues>({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    avatar_url: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error
        
        if (profile) {
          console.log('Loading profile data:', profile)
          setProfile({
            full_name: profile.full_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            company: profile.company || '',
            avatar_url: profile.avatar_url || '',
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      }
    }
    loadProfile()
  }, [])

  const handleAvatarChange = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }))
  }

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      console.log('Updating profile with values:', values)

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

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            avatarUrl={profile.avatar_url}
            fullName={profile.full_name}
            onAvatarChange={handleAvatarChange}
          />
          <ProfileForm
            initialValues={profile}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}