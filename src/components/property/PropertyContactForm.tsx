
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
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${propertyName}...`
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isSubmitting || isSuccess) return;
    
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
        throw new Error('Please fill out all required fields');
      }

      // Insert into leads table
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

      if (leadsError) throw leadsError;

      // Insert into contact_submissions table
      const { error: contactError } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'new'
        });

      if (contactError) throw contactError;

      toast({
        title: 'Message Sent',
        description: 'Thank you for your interest. We will get back to you soon.',
      });
      
      // Show success state
      setIsSuccess(true);
      
      // Reset form but don't close success state
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: `I'm interested in ${propertyName}...`
        });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 h-32"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );

  const SuccessContent = () => (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
      <p className="text-muted-foreground">
        Thank you for your interest in {propertyName}.
        <br />
        We'll get back to you as soon as possible.
      </p>
      <Button 
        onClick={() => setIsSuccess(false)} 
        variant="outline"
        className="mt-4"
      >
        Send Another Message
      </Button>
    </div>
  );

  const content = (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{t('property.contactUs')}</h3>
      {isSuccess ? <SuccessContent /> : <FormContent />}
    </div>
  );

  if (enableBorderBeam) {
    return (
      <BorderBeam>
        <div className="p-6">
          {content}
        </div>
      </BorderBeam>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      {content}
    </div>
  );
};
