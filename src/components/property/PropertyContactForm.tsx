
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
import { Loader2, Send } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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
        throw new Error(t('common.requiredFields'));
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

      toast({
        title: t('common.success'),
        description: t('contact.messageSent'),
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: `I'm interested in the property "${propertyName}". `
      });
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('contact.errorSending'),
        variant: 'destructive',
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 relative">
      {enableBorderBeam && <BorderBeam delay={10} />}
      <h2 className="text-2xl font-semibold mb-4">{t('property.contactUs')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">{t('common.name')} *</Label>
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
          <Label htmlFor="email">{t('common.email')} *</Label>
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
          <Label htmlFor="phone">{t('common.phone')} ({t('common.optional')})</Label>
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
          <Label htmlFor="message">{t('common.message')} *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 h-24"
            placeholder={t('property.messageAboutProperty')}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.sending')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('common.sendMessage')}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
