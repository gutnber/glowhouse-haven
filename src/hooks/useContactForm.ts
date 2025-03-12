
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const useContactForm = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize the form using react-hook-form
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const resetForm = () => {
    form.reset({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsSuccess(false);
  };

  const handleSubmit = async (data: ContactFormValues) => {
    if (isSubmitting) {
      console.log('Form already submitting, preventing double submission');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting form submission...', data);

    try {
      if (!data.name || !data.email || !data.message) {
        throw new Error(language === 'es' ? 
          'Por favor complete todos los campos requeridos' : 
          'Please fill out all required fields');
      }

      console.log('Validations passed, submitting to database...');

      // First insert into the database
      const { data: insertedData, error: insertError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message,
          status: 'new'
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting contact submission:', insertError);
        throw new Error(language === 'es' ? 
          'Error al guardar el mensaje: ' + insertError.message : 
          'Error saving the message: ' + insertError.message);
      }

      console.log('Contact submission successful:', insertedData);

      // Add to newsletter_subscribers if it doesn't exist already
      const { error: subscribeError } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: data.email },
          { onConflict: 'email', ignoreDuplicates: true }
        );

      if (subscribeError) {
        console.error('Error adding to subscribers:', subscribeError);
        // Continue since this is not critical
      } else {
        console.log('Added email to subscribers');
      }

      // Then try to send the email using the edge function
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: { record: insertedData }
      });

      if (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue since the data was saved successfully
      } else {
        console.log('Email notification sent successfully');
      }

      toast({
        title: language === 'es' ? 'Mensaje Enviado' : 'Message Sent',
        description: language === 'es' ? 
          'Gracias por su mensaje. Nos pondremos en contacto pronto.' : 
          'Thank you for your message. We will get back to you soon.',
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || (language === 'es' ? 
          'Hubo un problema al enviar su mensaje' : 
          'There was a problem sending your message'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isSuccess,
    handleSubmit,
    resetForm
  };
};
