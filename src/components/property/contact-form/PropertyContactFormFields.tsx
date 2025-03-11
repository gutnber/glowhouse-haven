
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { PropertyContactFormValues } from '@/hooks/usePropertyContactForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PropertyContactFormFieldsProps {
  form: UseFormReturn<PropertyContactFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: PropertyContactFormValues) => void;
}

export const PropertyContactFormFields = ({ 
  form, 
  isSubmitting, 
  onSubmit 
}: PropertyContactFormFieldsProps) => {
  const { t } = useLanguage();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">{t('contactForm.name')} *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
                    disabled={isSubmitting}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">{t('contactForm.email')} *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
                    disabled={isSubmitting}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">{t('contactForm.phone')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    className="mt-1 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">{t('contactForm.message')} *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="mt-1 h-32 bg-white/10 border-orange-500/30 focus:border-orange-400 text-white"
                    disabled={isSubmitting}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
      </form>
    </Form>
  );
};
