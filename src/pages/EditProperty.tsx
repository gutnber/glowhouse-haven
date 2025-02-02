import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyForm } from "@/components/property/PropertyForm"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

const propertyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  build_year: z.number().min(1800).max(new Date().getFullYear()),
  price: z.number().min(0),
  arv: z.number().min(0).optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  google_maps_url: z.string().optional().nullable(),
  youtube_url: z.string().optional().nullable(),
  youtube_autoplay: z.boolean().optional().nullable(),
  youtube_muted: z.boolean().optional().nullable(),
  youtube_controls: z.boolean().optional().nullable(),
  enable_border_beam: z.boolean().optional().nullable(),
  property_type: z.string(),
  mode: z.string(),
  status: z.string()
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

const EditProperty = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  console.log('Fetching property with ID:', id)
  
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log('Making Supabase query for property:', id)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching property:', error)
        throw error
      }
      console.log('Fetched property data:', data)
      return data
    },
    enabled: !!id
  })

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    values: property ? {
      ...property,
      youtube_autoplay: property.youtube_autoplay ?? false,
      youtube_muted: property.youtube_muted ?? true,
      youtube_controls: property.youtube_controls ?? true,
      enable_border_beam: property.enable_border_beam ?? true,
    } : undefined,
  })

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      console.log('Updating property with values:', values)
      const { error } = await supabase
        .from('properties')
        .update({
          ...values,
          google_maps_url: values.google_maps_url || null,
          youtube_url: values.youtube_url || null,
          youtube_autoplay: values.youtube_autoplay,
          youtube_muted: values.youtube_muted,
          youtube_controls: values.youtube_controls,
          enable_border_beam: values.enable_border_beam,
        })
        .eq('id', id)

      if (error) throw error
      return values
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property updated successfully",
      })
      navigate('/properties')
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
    mutation.mutate(values)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">Property not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Property</h1>
      <PropertyForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}

export default EditProperty