import { ProfileAvatar } from "@/components/settings/ProfileAvatar"
import { ProfileForm, ProfileFormValues } from "@/components/settings/ProfileForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileTabProps {
  initialValues: ProfileFormValues
  onSubmit: (values: ProfileFormValues) => Promise<void>
  isLoading: boolean
  userId: string
  onAvatarChange: (url: string) => void
}

export function ProfileTab({ 
  initialValues, 
  onSubmit, 
  isLoading, 
  userId, 
  onAvatarChange 
}: ProfileTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your profile information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileAvatar
          userId={userId}
          avatarUrl={initialValues.avatar_url}
          onAvatarChange={onAvatarChange}
        />
        <ProfileForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}