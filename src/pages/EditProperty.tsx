import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyForm } from "@/components/property/PropertyForm"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
  images: z.array(z.string()).optional().nullable(),
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
    defaultValues: property || {
      name: '',
      address: '',
      bedrooms: 0,
      bathrooms: 0,
      build_year: new Date().getFullYear(),
      price: 0,
      arv: null,
      description: '',
      features: [],
      images: []
    }
  })

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      console.log('Updating property with values:', values)
      const { error } = await supabase
        .from('properties')
        .update(values)
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
    return <div>Loading property...</div>
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