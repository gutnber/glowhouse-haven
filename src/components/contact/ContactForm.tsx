
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

  const formValues = form.getValues();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    form.setValue(name, value);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <ContactFormFields
        formData={formValues}
        isSubmitting={isSubmitting}
        onChange={handleInputChange}
      />
    </form>
  );
};
