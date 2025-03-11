
import { useParams, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePropertyData } from "@/hooks/usePropertyData"
import { PropertyFormWrapper } from "@/components/property/PropertyFormWrapper"
import { PropertyDeleteButton } from "@/components/property/PropertyDeleteButton"
import { Tables } from "@/integrations/supabase/types"

type PropertyType = Tables<"properties">

const EditProperty = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()
  const { t } = useLanguage()

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
        <p className="text-lg text-muted-foreground">{t('property.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">{t('property.edit')}</h1>
            <PropertyDeleteButton propertyId={id} />
          </div>
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl border border-orange-500/30 shadow-xl">
            <PropertyFormWrapper
              form={form}
              onSubmit={onSubmit}
              isSubmitting={updateMutation.isPending}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditProperty
