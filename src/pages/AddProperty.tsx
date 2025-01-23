import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import { Building2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { PropertyForm } from "@/components/property/PropertyForm"
import { TooltipProvider } from "@/components/ui/tooltip"

const propertyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be 0 or more"),
  build_year: z.coerce.number().min(1800, "Build year must be 1800 or later").max(new Date().getFullYear(), "Build year cannot be in the future"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  arv: z.coerce.number().positive("ARV must be greater than 0").optional(),
  features: z.string().transform(str => str ? str.split(',').map(s => s.trim()).filter(Boolean) : []),
  images: z.array(z.string()).optional(),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

const AddProperty = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      build_year: new Date().getFullYear(),
      description: "",
      price: 0,
      arv: undefined,
      features: [],
      images: [],
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      console.log('Submitting property:', values)
      const { error } = await supabase
        .from('properties')
        .insert({
          name: values.name,
          address: values.address,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          build_year: values.build_year,
          description: values.description,
          price: values.price,
          arv: values.arv,
          features: values.features,
          images: values.images,
        })
      
      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property has been added successfully",
      })
      navigate('/properties')
    },
    onError: (error) => {
      console.error('Error adding property:', error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: PropertyFormValues) => {
    mutation.mutate(values)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Add New Property</h1>
        </div>
        <PropertyForm 
          form={form} 
          onSubmit={onSubmit} 
          isSubmitting={mutation.isPending} 
        />
      </div>
    </TooltipProvider>
  )
}

export default AddProperty