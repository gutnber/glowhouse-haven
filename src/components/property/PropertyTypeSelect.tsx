import { Building2, Home, Building } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"

const propertyTypes = [
  { value: "all", icon: Building2 },
  { value: "singleFamily", icon: Home },
  { value: "townhouse", icon: Building },
  { value: "vacantLand", icon: Building2 },
  { value: "condo", icon: Building },
  { value: "apartment", icon: Building2 },
  { value: "multifamily", icon: Building },
  { value: "commercial", icon: Building2 }
]

interface PropertyTypeSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function PropertyTypeSelect({ value, onValueChange }: PropertyTypeSelectProps) {
  const { t } = useLanguage()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px] bg-white/10 text-white border-white/20">
        <SelectValue placeholder={t('propertyType')} />
      </SelectTrigger>
      <SelectContent>
        {propertyTypes.map((type) => {
          const Icon = type.icon
          return (
            <SelectItem 
              key={type.value} 
              value={type.value}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{t(type.value)}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}