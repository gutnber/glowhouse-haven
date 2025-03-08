
import { useQuery, useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { propertyFormSchema, PropertyFormValues } from "@/schemas/propertyFormSchema"

export const usePropertyData = (propertyId: string, onSuccess: () => void) => {
  const { toast } = useToast()

  const {
    data: property,
    isLoading,
    error: fetchError
  } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      console.log('Making Supabase query for property:', propertyId)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()
      
      if (error) {
        console.error('Error fetching property:', error)
        throw error
      }
      console.log('Fetched property data:', data)
      return data
    },
    enabled: !!propertyId
  })

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    values: property ? {
      ...property,
      // Handle potentially missing fields with default values
      currency: property.currency || "USD",
      price_per_sqm: property.price_per_sqm ?? null,
      youtube_autoplay: property.youtube_autoplay ?? false,
      youtube_muted: property.youtube_muted ?? true,
      youtube_controls: property.youtube_controls ?? true,
      enable_border_beam: property.enable_border_beam ?? true,
      area: property.area ?? null,
      width: property.width ?? null,
      height: property.height ?? null,
      heated_area: property.heated_area ?? null,
      images: property.images || [],
    } : undefined,
  })

  const updateMutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      console.log('Updating property with values:', values)
      const { error } = await supabase
        .from('properties')
        .update({
          ...values,
          currency: values.currency || "USD",
          price_per_sqm: values.price_per_sqm || null,
          google_maps_url: values.google_maps_url || null,
          youtube_url: values.youtube_url || null,
          youtube_autoplay: values.youtube_autoplay,
          youtube_muted: values.youtube_muted,
          youtube_controls: values.youtube_controls,
          enable_border_beam: values.enable_border_beam,
          area: values.area || null,
          width: values.width || null,
          height: values.height || null,
          heated_area: values.heated_area || null,
        })
        .eq('id', propertyId)

      if (error) throw error
      return values
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property updated successfully",
      })
      onSuccess()
    },
    onError: (error) => {
      console.error('Error updating property:', error)
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      })
    }
  })

  const onSubmit = (values: PropertyFormValues) => {
    updateMutation.mutate(values)
  }

  return {
    property,
    isLoading,
    fetchError,
    form,
    updateMutation,
    onSubmit
  }
}
