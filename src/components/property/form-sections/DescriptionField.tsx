import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/LanguageContext"

interface DescriptionFieldProps {
  form: UseFormReturn<any>
}

export const DescriptionField = ({ form }: DescriptionFieldProps) => {
  const { t } = useLanguage()
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-orange-500">{t('property.description')} ({t('optional')})</FormLabel>
          <FormControl>
            <Textarea placeholder={t('property.enterDescription')} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}