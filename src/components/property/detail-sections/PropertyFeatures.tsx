
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFeaturesProps {
  features: string[] | null;
}

export const PropertyFeatures = ({ features }: PropertyFeaturesProps) => {
  const { t } = useLanguage();
  
  if (!features || features.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{t('property.features')}</h3>
      <ul className="grid grid-cols-2 gap-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
