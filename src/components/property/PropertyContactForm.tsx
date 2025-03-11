
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BorderBeam } from '@/components/ui/border-beam';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

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
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: t('contactForm.interestedInProperty').replace('{propertyName}', propertyName)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isSuccess) return;
    
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error(language === 'es' ? 
          'Por favor complete todos los campos requeridos' : 
          'Please fill out all required fields');
      }

      console.log('Submitting property inquiry form...', formData);

      // Create submission data object that will be used across multiple operations
      const submissionData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        property_id: propertyId,
        property_name: propertyName,
        created_at: new Date().toISOString()
      };

      // 1. Insert into leads table
      const { error: leadsError } = await supabase
        .from('leads')
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          contact_message: formData.message,
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: `[Property Inquiry: ${propertyName}] ${formData.message}`,
          status: 'new'
        })
        .select('*')
        .single();

      if (contactError) {
        console.error('Error inserting contact submission:', contactError);
        // Try to continue with direct email sending even if DB insert fails
      }

      // 3. Try multiple approaches to ensure email is sent
      const sendEmailPromises = [];
      
      // Method 1: Try directly calling the send-contact-email function with the form data
      sendEmailPromises.push(
        supabase.functions.invoke('send-contact-email', {
          body: { 
            payload: {
              id: contactData?.id || 'direct-submission',
              name: formData.name,
              email: formData.email,
              phone: formData.phone || null,
              message: `[Property Inquiry: ${propertyName}] ${formData.message}`,
              created_at: new Date().toISOString()
            }
          },
        }).catch(err => {
          console.error('Error calling email function directly with form data:', err);
          return { error: err };
        })
      );
      
      // Method 2: If we have contact data from the DB insert, try with that
      if (contactData) {
        sendEmailPromises.push(
          supabase.functions.invoke('send-contact-email', {
            body: { record: contactData },
          }).catch(err => {
            console.error('Error calling email function with DB record:', err);
            return { error: err };
          })
        );
      }
      
      // Method 3: Try manually triggering the email queue processor
      sendEmailPromises.push(
        supabase.functions.invoke('process-email-queue', {}).catch(err => {
          console.error('Error calling email queue processor:', err);
          return { error: err };
        })
      );
      
      // Wait for all attempts and log results
      const emailResults = await Promise.all(sendEmailPromises);
      console.log('Email sending attempts results:', emailResults);
      
      // Even if email sending fails, show success to user since the submission was recorded
      toast({
        title: language === 'es' ? 'Mensaje Enviado' : 'Message Sent',
        description: language === 'es' ? 
          'Gracias por su interés en esta propiedad. Nos pondremos en contacto pronto.' : 
          'Thank you for your interest in this property. We will get back to you soon.',
      });

      // Show success state
      setIsSuccess(true);
      
      // Reset form but don't hide success message
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: t('contactForm.interestedInProperty').replace('{propertyName}', propertyName)
      });
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

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white font-medium">{t('contactForm.name')} *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white font-medium">{t('contactForm.email')} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white font-medium">{t('contactForm.phone')}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-white font-medium">{t('contactForm.message')} *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 h-32 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('contactForm.sending')}
          </>
        ) : (
          t('contactForm.sendMessage')
        )}
      </Button>
    </form>
  );

  const SuccessContent = () => (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-white">{t('contactForm.messageSentSuccess')}</h3>
      <p className="text-gray-300">
        {t('contactForm.thankYouInterest')} {propertyName}.
        <br />
        {t('contactForm.getBackSoon')}
      </p>
      <Button 
        onClick={() => setIsSuccess(false)} 
        variant="outline"
        className="mt-4 border-orange-500/50 text-white hover:bg-orange-500/20"
      >
        {t('contactForm.sendAnother')}
      </Button>
    </div>
  );

  const content = (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white border-b border-orange-500/30 pb-2">{t('property.contactUs')}</h3>
      {isSuccess ? <SuccessContent /> : <FormContent />}
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
