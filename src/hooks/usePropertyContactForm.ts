
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';

export interface PropertyContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface UsePropertyContactFormProps {
  propertyId: string;
  propertyName: string;
}

export const usePropertyContactForm = ({ propertyId, propertyName }: UsePropertyContactFormProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const defaultMessage = t('contactForm.interestedInProperty').replace('{propertyName}', propertyName);
  
  const form = useForm<PropertyContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: defaultMessage
    }
  });

  const resetForm = () => {
    form.reset({
      name: '',
      email: '',
      phone: '',
      message: defaultMessage
    });
  };

  const handleSubmit = async (data: PropertyContactFormValues) => {
    if (isSubmitting || isSuccess) return;
    
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!data.name || !data.email || !data.message) {
        throw new Error(language === 'es' ? 
          'Por favor complete todos los campos requeridos' : 
          'Please fill out all required fields');
      }

      console.log('Submitting property inquiry form...', data);

      // Create submission data object that will be used across multiple operations
      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        property_id: propertyId,
        property_name: propertyName,
        created_at: new Date().toISOString()
      };

      // 1. Insert into leads table
      const { error: leadsError } = await supabase
        .from('leads')
        .insert({
          full_name: data.name,
          email: data.email,
          phone: data.phone || null,
          contact_message: data.message,
          inquiry_property_id: propertyId,
          inquiry_property_name: propertyName,
          status: 'new'
        });

      if (leadsError) {
        console.error('Error inserting into leads:', leadsError);
        // Continue to next step even if this fails
      }

      // 2. Insert into contact_submissions table
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: `[Property Inquiry: ${propertyName}] ${data.message}`,
          status: 'new'
        })
        .select('*')
        .single();

      if (contactError) {
        console.error('Error inserting contact submission:', contactError);
        throw contactError;
      }

      // 3. Only use one email sending method to prevent duplicates
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: { record: contactData },
      });
      
      if (emailError) {
        console.error('Error sending email:', emailError);
        // Continue anyway as the submission was recorded in the database
      }

      toast({
        title: language === 'es' ? 'Mensaje Enviado' : 'Message Sent',
        description: language === 'es' ? 
          'Gracias por su interés en esta propiedad. Nos pondremos en contacto pronto.' : 
          'Thank you for your interest in this property. We will get back to you soon.',
      });

      // Show success state
      setIsSuccess(true);
      
      // Reset form but don't hide success message
      resetForm();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'There was a problem sending your message',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSuccessState = () => {
    setIsSuccess(false);
  };

  return {
    form,
    isSubmitting,
    isSuccess,
    handleSubmit,
    resetSuccessState
  };
};
