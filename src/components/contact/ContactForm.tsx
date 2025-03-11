
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';

export const ContactForm = () => {
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
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error(language === 'es' ? 'Por favor complete todos los campos requeridos' : 'Please fill out all required fields');
      }

      // Insert the form data into the contact_submissions table
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'new'
        })
        .select('*')
        .single();

      if (error) throw error;

      // Display toast notification
      toast({
        title: language === 'es' ? 'Mensaje Enviado' : 'Message Sent',
        description: language === 'es' ? 'Gracias por su mensaje. Nos pondremos en contacto pronto.' : 'Thank you for your message. We will get back to you soon.',
      });

      // Show success state
      setIsSuccess(true);
      
      // Reset form but don't hide success message
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
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

  // If success, show success message
  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {language === 'es' ? 'Mensaje Enviado Exitosamente!' : 'Message Sent Successfully!'}
        </h3>
        <p className="text-orange-200">
          {language === 'es' 
            ? 'Gracias por contactarnos. Nos pondremos en contacto con usted lo antes posible.'
            : 'Thank you for contacting us. We will get back to you as soon as possible.'}
        </p>
        <Button 
          onClick={() => setIsSuccess(false)} 
          className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
        >
          {language === 'es' ? 'Enviar otro mensaje' : 'Send another message'}
        </Button>
      </div>
    );
  }

  return (
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
};
