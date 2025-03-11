
import { useContactForm } from '@/hooks/useContactForm';
import { ContactFormFields } from './ContactFormFields';
import { ContactFormSuccess } from './ContactFormSuccess';

export const ContactForm = () => {
  const {
    formData,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
    setIsSuccess
  } = useContactForm();

  if (isSuccess) {
    return <ContactFormSuccess onReset={() => setIsSuccess(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ContactFormFields
        formData={formData}
        isSubmitting={isSubmitting}
        onChange={handleChange}
      />
    </form>
  );
};
