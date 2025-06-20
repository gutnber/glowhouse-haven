
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { AISettings } from "@/types/ai-settings"

export function useAISettings() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['ai-settings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('ai_settings')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data?.ai_settings as unknown as AISettings | null
    }
  })

  const updateSettings = useMutation({
    mutationFn: async (newSettings: AISettings) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ ai_settings: newSettings as any })
        .eq('id', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] })
    }
  })

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutateAsync,
    isUpdating: updateSettings.isPending
  }
}
