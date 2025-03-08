
import { useParams, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { usePropertyData } from "@/hooks/usePropertyData"
import { PropertyFormWrapper } from "@/components/property/PropertyFormWrapper"
import { PropertyDeleteButton } from "@/components/property/PropertyDeleteButton"

const EditProperty = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()

  const {
    property,
    isLoading,
    form,
    updateMutation,
    onSubmit
  } = usePropertyData(id, () => navigate('/properties'))

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Edit Property</h1>
        <PropertyDeleteButton propertyId={id} />
      </div>
      <PropertyFormWrapper
        form={form}
        onSubmit={onSubmit}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  )
}

export default EditProperty
