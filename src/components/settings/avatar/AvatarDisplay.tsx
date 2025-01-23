import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface AvatarDisplayProps {
  avatarUrl?: string | null
  fallbackText: string
}

export function AvatarDisplay({ avatarUrl, fallbackText }: AvatarDisplayProps) {
  return (
    <Avatar className="h-24 w-24">
      <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
      <AvatarFallback className="text-lg">
        {avatarUrl ? <User className="h-12 w-12" /> : fallbackText}
      </AvatarFallback>
    </Avatar>
  )
}