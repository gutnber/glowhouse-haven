
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';

export const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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
        throw new Error(language === 'es' ? 'Por favor complete todos los campos requeridos' : 'Please fill out all required fields');
      }

      // Insert the contact submission
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: language === 'es' ? 'Mensaje Enviado' : 'Message Sent',
        description: language === 'es' ? 'Gracias por su mensaje. Nos pondremos en contacto pronto.' : 'Thank you for your message. We will get back to you soon.',
      });
      
      // Set success state
      setIsSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        // Reset success after longer delay
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }, 500);
    } catch (error: any) {
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
          <Label htmlFor="name" className="text-white font-medium">{language === 'es' ? 'Nombre *' : 'Name *'}</Label>
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
          <Label htmlFor="email" className="text-white font-medium">{language === 'es' ? 'Correo Electrónico *' : 'Email *'}</Label>
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
          <Label htmlFor="phone" className="text-white font-medium">{language === 'es' ? 'Teléfono (opcional)' : 'Phone (optional)'}</Label>
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
          <Label htmlFor="message" className="text-white font-medium">{language === 'es' ? 'Mensaje *' : 'Message *'}</Label>
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
            {language === 'es' ? 'Enviando...' : 'Sending...'}
          </>
        ) : (
          language === 'es' ? 'Enviar Mensaje' : 'Send Message'
        )}
      </Button>
    </form>
  );

  const SuccessContent = () => (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-white">
        {language === 'es' ? '¡Mensaje Enviado Exitosamente!' : 'Message Sent Successfully!'}
      </h3>
      <p className="text-orange-200">
        {language === 'es' ? 'Gracias por contactarnos.' : 'Thank you for contacting us.'}
        <br />
        {language === 'es' ? 'Nos pondremos en contacto con usted lo antes posible.' : 'We\'ll get back to you as soon as possible.'}
      </p>
      <Button 
        onClick={() => setIsSuccess(false)} 
        variant="outline"
        className="mt-4 border-orange-500/50 text-white hover:bg-orange-500/20"
      >
        {language === 'es' ? 'Enviar Otro Mensaje' : 'Send Another Message'}
      </Button>
    </div>
  );

  return isSuccess ? <SuccessContent /> : <FormContent />;
};
