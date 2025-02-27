
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Add translations for the form fields
  const translations = {
    en: {
      "common.name": "Name",
      "common.email": "Email",
      "common.phone": "Phone",
      "common.optional": "Optional",
      "common.message": "Message",
      "common.sending": "Sending...",
      "common.sendMessage": "Send Message",
      "common.success": "Success",
      "contact.messageSent": "Your message has been sent successfully!",
      "contact.errorSending": "There was an error sending your message. Please try again.",
      "common.error": "Error",
      "common.requiredFields": "Please fill in all required fields.",
      "property.contactUs": "Contact Us",
      "property.messageAboutProperty": "Message about the property..."
    },
    es: {
      "common.name": "Nombre",
      "common.email": "Correo Electrónico",
      "common.phone": "Teléfono",
      "common.optional": "Opcional",
      "common.message": "Mensaje",
      "common.sending": "Enviando...",
      "common.sendMessage": "Enviar Mensaje",
      "common.success": "Éxito",
      "contact.messageSent": "¡Tu mensaje ha sido enviado con éxito!",
      "contact.errorSending": "Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.",
      "common.error": "Error",
      "common.requiredFields": "Por favor complete todos los campos requeridos.",
      "property.contactUs": "Contáctenos",
      "property.messageAboutProperty": "Mensaje sobre la propiedad..."
    }
  };

  // Helper function to get translated text
  const getTranslatedText = (key: string) => {
    const { language } = useLanguage();
    return translations[language][key] || key;
  };

  // Initialize the message with a template that includes the property name
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      message: `I'm interested in the property "${propertyName}". `
    }));
  }, [propertyName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error(getTranslatedText('common.requiredFields'));
      }

      // Insert the lead first
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          contact_message: formData.message,
          inquiry_property_id: propertyId,
          inquiry_property_name: propertyName,
          status: 'new'
        } as Tables<'leads'>);

      if (leadError) throw leadError;

      // Also insert into contact_submissions
      const { error: contactError } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: `[Property Inquiry: ${propertyName}] ${formData.message}`,
          status: 'new'
        });

      if (contactError) throw contactError;

      // Show toast notification
      toast({
        title: getTranslatedText('common.success'),
        description: getTranslatedText('contact.messageSent'),
      });
      
      // Show success animation immediately
      setIsSuccess(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: `I'm interested in the property "${propertyName}". `
        });
        
        // Keep the success state for 5 seconds before allowing new submissions
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }, 500);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({
        title: getTranslatedText('common.error'),
        description: error.message || getTranslatedText('contact.errorSending'),
        variant: 'destructive',
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-6 relative bg-green-50 dark:bg-green-900/20">
        {enableBorderBeam && <BorderBeam delay={10} />}
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="animate-pulse">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold">{getTranslatedText('common.success')}</h2>
          <p className="text-lg">{getTranslatedText('contact.messageSent')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 relative">
      {enableBorderBeam && <BorderBeam delay={10} />}
      <h2 className="text-2xl font-semibold mb-4">{getTranslatedText('property.contactUs')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">{getTranslatedText('common.name')} *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">{getTranslatedText('common.email')} *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">{getTranslatedText('common.phone')} ({getTranslatedText('common.optional')})</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message">{getTranslatedText('common.message')} *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 h-24"
            placeholder={getTranslatedText('property.messageAboutProperty')}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getTranslatedText('common.sending')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {getTranslatedText('common.sendMessage')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
