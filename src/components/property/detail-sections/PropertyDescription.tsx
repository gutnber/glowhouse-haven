
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyDescriptionProps {
  description: string | null;
}

export const PropertyDescription = ({ description }: PropertyDescriptionProps) => {
  const { t } = useLanguage();
  
  if (!description) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-white">{t('property.description')}</h3>
      <div className="prose prose-sm max-w-none dark:prose-invert text-white">
        {description.split('\n').map((paragraph, i) => (
          <p key={i} className="text-white">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};
