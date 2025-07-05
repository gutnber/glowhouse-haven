
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Building2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/LanguageContext"
import { PropertyForm } from "@/components/property/PropertyForm"
import { propertyFormSchema, PropertyFormValues } from "@/schemas/propertyFormSchema"
import { useEasyBrokerSync } from "@/hooks/useEasyBrokerSync"

const AddProperty = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { syncToEasyBroker } = useEasyBrokerSync()
  
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
      price_per_sqm: null,
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
      status: "available",
      is_desarrollo: false
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
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
          price_per_sqm: values.price_per_sqm,
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
          status: values.status,
          is_desarrollo: values.is_desarrollo
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Property has been added successfully",
      })
      
      // Automatically sync to EasyBroker
      console.log('Auto-syncing property to EasyBroker:', data)
      syncToEasyBroker(data)
      
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
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-white">{t('addProperty')}</h1>
          </div>
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl border border-orange-500/30 shadow-xl">
            <PropertyForm 
              form={form} 
              onSubmit={onSubmit} 
              isSubmitting={mutation.isPending} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddProperty
