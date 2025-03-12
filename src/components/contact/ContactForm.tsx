
import React from 'react';
import { ContactFormFields } from './ContactFormFields';
import { ContactFormSuccess } from './ContactFormSuccess';
import { UseFormReturn } from 'react-hook-form';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: (data: ContactFormValues) => void;
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

  return <ContactFormFields form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />;
};
