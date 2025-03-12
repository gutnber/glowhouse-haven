
import { useForm } from 'react-hook-form';
import { ContactFormFields } from './ContactFormFields';
import { ContactFormSuccess } from './ContactFormSuccess';

interface ContactFormProps {
  form: any;
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: (data: any) => void;
  resetForm: () => void;
}

export const ContactForm = ({
  form,
  isSubmitting,
  isSuccess,
  onSubmit,
  resetForm
}: ContactFormProps) => {
  if (isSuccess) {
    return <ContactFormSuccess onReset={resetForm} />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <ContactFormFields
        formData={form.getValues()}
        isSubmitting={isSubmitting}
        onChange={(e) => {
          const { name, value } = e.target;
          form.setValue(name as any, value);
        }}
      />
    </form>
  );
};
