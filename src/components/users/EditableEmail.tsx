
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditableEmailProps {
  userId: string
  initialEmail: string
  onEmailUpdate: () => Promise<void>
}

export const EditableEmail = ({ userId, initialEmail, onEmailUpdate }: EditableEmailProps) => {
  const { toast } = useToast()
  const [editingEmail, setEditingEmail] = useState<{ id: string; email: string } | null>(null)

  const handleEmailUpdate = async (userId: string, newEmail: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email: newEmail,
      })
      if (error) throw error
      
      await onEmailUpdate()
      setEditingEmail(null)
      toast({
        title: "Success",
        description: "Email updated successfully",
      })
    } catch (error) {
      console.error("Error updating email:", error)
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      })
    }
  }

  if (editingEmail?.id === userId) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editingEmail.email}
          onChange={(e) =>
            setEditingEmail({ id: userId, email: e.target.value })
          }
          className="w-48"
        />
        <Button
          size="sm"
          onClick={() => handleEmailUpdate(userId, editingEmail.email)}
        >
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditingEmail(null)}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {initialEmail}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setEditingEmail({ id: userId, email: initialEmail })}
      >
        Edit
      </Button>
    </div>
  )
}
