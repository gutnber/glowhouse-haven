
import { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/contexts/LanguageContext"

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>
}

export const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  const { t } = useLanguage()

  const propertyTypes = [
    { value: "singleFamily", label: t("singleFamily") },
    { value: "condo", label: t("condo") },
    { value: "apartment", label: t("apartment") },
    { value: "vacantLand", label: t("vacantLand") },
    { value: "ranch", label: t("ranch") },
    { value: "cabin", label: t("cabin") },
    { value: "commercial", label: t("commercial") },
    { value: "townhouse", label: t("townhouse") },
    { value: "multifamily", label: t("multifamily") }
  ]

  const propertyModes = [
    { value: "sale", label: t("forSale") },
    { value: "rent", label: t("forRent") }
  ]

  const propertyStatuses = [
    { value: "available", label: t("available") },
    { value: "pending", label: t("pending") },
    { value: "sold", label: t("sold") }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.name')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('property.address')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="property_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('propertyType')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('propertyMode')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-orange-500">{t('propertyStatus')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_desarrollo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox 
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-orange-500 font-medium">Desarrollo Frasa</FormLabel>
              <p className="text-sm text-muted-foreground">
                Marcar si esta propiedad pertenece al desarrollo Frasa
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
