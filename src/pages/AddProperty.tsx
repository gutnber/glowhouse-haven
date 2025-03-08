
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import { Building2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { PropertyForm } from "@/components/property/PropertyForm"

const propertyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be 0 or more").optional(),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be 0 or more").optional(),
  build_year: z.coerce.number().min(1800, "Build year must be 1800 or later").max(new Date().getFullYear(), "Build year cannot be in the future"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  currency: z.string().default("USD"),
  arv: z.coerce.number().positive("ARV must be greater than 0").optional(),
  area: z.coerce.number().positive("Area must be greater than 0").optional(),
  width: z.coerce.number().positive("Width must be greater than 0").optional(),
  height: z.coerce.number().positive("Height must be greater than 0").optional(),
  heated_area: z.coerce.number().positive("Heated area must be greater than 0").optional(),
  reference_number: z.string().optional(),
  features: z.string().transform(str => str ? str.split(',').map(s => s.trim()).filter(Boolean) : []),
  images: z.array(z.string()).optional(),
  property_type: z.string(),
  mode: z.string(),
  status: z.string()
})

const AddProperty = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      build_year: new Date().getFullYear(),
      description: "",
      price: 0,
      currency: "USD",
      arv: undefined,
      area: undefined,
      width: undefined,
      height: undefined,
      heated_area: undefined,
      reference_number: "",
      features: [],
      images: [],
      property_type: "singleFamily",
      mode: "sale",
      status: "available"
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof propertyFormSchema>) => {
      console.log('Submitting property:', values)
      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: values.name,
          address: values.address,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          build_year: values.build_year,
          description: values.description,
          price: values.price,
          currency: values.currency,
          arv: values.arv,
          area: values.area,
          width: values.width,
          height: values.height,
          heated_area: values.heated_area,
          reference_number: values.reference_number,
          features: values.features,
          images: values.images,
          property_type: values.property_type,
          mode: values.mode,
          status: values.status
        })
        .select()
        .single()
      
      if (error) throw error
      return data
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

  const onSubmit = (values: z.infer<typeof propertyFormSchema>) => {
    mutation.mutate(values)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
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
  )
}

export default AddProperty
