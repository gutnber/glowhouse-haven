
import { BorderBeam } from '@/components/ui/border-beam';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePropertyContactForm } from '@/hooks/usePropertyContactForm';
import { PropertyContactFormFields } from './contact-form/PropertyContactFormFields';
import { PropertyContactSuccess } from './contact-form/PropertyContactSuccess';

interface PropertyContactFormProps {
  propertyId: string;
  propertyName: string;
  enableBorderBeam?: boolean | null;
}

export const PropertyContactForm = ({ 
  propertyId, 
  propertyName,
  enableBorderBeam = true
}: PropertyContactFormProps) => {
  const { t } = useLanguage();
  const {
    form,
    isSubmitting,
    isSuccess,
    handleSubmit,
    resetSuccessState
  } = usePropertyContactForm({ propertyId, propertyName });

  const content = (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white border-b border-orange-500/30 pb-2">{t('property.contactUs')}</h3>
      {isSuccess ? (
        <PropertyContactSuccess 
          propertyName={propertyName} 
          onSendAnother={resetSuccessState} 
        />
      ) : (
        <PropertyContactFormFields 
          form={form} 
          isSubmitting={isSubmitting} 
          onSubmit={handleSubmit} 
        />
      )}
    </div>
  );

  if (enableBorderBeam) {
    return (
      <div className="relative border border-orange-500/30 rounded-xl overflow-hidden">
        <BorderBeam />
        <div className="p-6">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-orange-500/30 rounded-xl p-6">
      {content}
    </div>
  );
};
