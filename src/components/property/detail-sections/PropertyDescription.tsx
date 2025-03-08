
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyDescriptionProps {
  description: string | null;
}

export const PropertyDescription = ({ description }: PropertyDescriptionProps) => {
  const { t } = useLanguage();
  
  if (!description) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{t('property.description')}</h3>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {description.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};
