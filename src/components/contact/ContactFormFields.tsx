
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ContactFormFields = ({ formData, isSubmitting, onChange }: ContactFormFieldsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-white font-medium">
          {t('contactForm.name')} *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-white font-medium">
          {t('contactForm.email')} *
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          required
          className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-white font-medium">
          {t('contactForm.phone')}
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-white font-medium">
          {t('contactForm.message')} *
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          required
          className="mt-1 h-32 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
          disabled={isSubmitting}
        />
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
    </div>
  );
};
