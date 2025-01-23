import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyForm } from "@/components/property/PropertyForm"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

const EditProperty = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    }
  })

  const form = useForm({
    defaultValues: property
  })

  const onSubmit = async (values: any) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(values)
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Property updated successfully",
      })

      navigate('/properties')
    } catch (error) {
      console.error('Error updating property:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      })
    }
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
        isSubmitting={false}
      />
    </div>
  )
}

export default EditProperty