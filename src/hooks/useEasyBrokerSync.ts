
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export const useEasyBrokerSync = () => {
  const { toast } = useToast()

  const syncToEasyBroker = useMutation({
    mutationFn: async (property: any) => {
      console.log('Initiating EasyBroker sync for property:', property.id)
      
      const { data, error } = await supabase.functions.invoke('easybroker-sync', {
        body: { property }
      })

      if (error) {
        console.error('EasyBroker sync error:', error)
        throw error
      }

      return data
    },
    onSuccess: (data) => {
      console.log('EasyBroker sync successful:', data)
      toast({
        title: "EasyBroker Sync Successful",
        description: "Property has been successfully pushed to EasyBroker",
      })
    },
    onError: (error) => {
      console.error('EasyBroker sync failed:', error)
      toast({
        title: "EasyBroker Sync Failed",
        description: `Failed to sync property to EasyBroker: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  return {
    syncToEasyBroker: syncToEasyBroker.mutate,
    isSyncing: syncToEasyBroker.isPending,
    syncError: syncToEasyBroker.error
  }
}
