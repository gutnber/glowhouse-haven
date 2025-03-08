
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";

interface NewsletterFormProps {
  placeholder: string | null;
}

export function NewsletterForm({ placeholder }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save the subscriber to the database
      const { error } = await supabase.from('newsletter_subscribers').insert([{ email }]);
      
      if (error) {
        if (error.code === '23505') {
          // Unique violation - email already exists
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter."
          });
        } else {
          console.error('Error subscribing:', error);
          toast({
            title: "Error",
            description: "Failed to subscribe. Please try again later.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Thank you for subscribing to our newsletter!"
        });

        // Show success state
        setIsSuccess(true);

        // Reset after delay
        setTimeout(() => {
          setEmail("");
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error in subscribe function:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Input 
          type="email" 
          placeholder={placeholder || "Enter your email"} 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="bg-gray-800 border-gray-700 text-white pr-10"
          disabled={isSubmitting || isSuccess} 
        />
      </div>
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground" 
        disabled={isSubmitting || isSuccess || !email}
      >
        {isSuccess ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
