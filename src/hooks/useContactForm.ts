
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
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
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Form already submitting, preventing double submission');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting form submission...', formData);

    try {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error(language === 'es' ? 
          'Por favor complete todos los campos requeridos' : 
          'Please fill out all required fields');
      }

      console.log('Validations passed, submitting to database...');

      // First insert into the database
      const { data: insertedData, error: insertError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
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
      resetForm();
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
    formData,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
    setIsSuccess
  };
};
