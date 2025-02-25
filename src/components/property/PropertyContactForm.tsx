
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface PropertyContactFormProps {
  propertyId: string
  propertyName: string
}

export function PropertyContactForm({ propertyId, propertyName }: PropertyContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First, detect area code using AI
      const { data: areaCodeData, error: areaCodeError } = await supabase.functions.invoke(
        'detect-area-code',
        {
          body: { phone },
        }
      )

      if (areaCodeError) throw areaCodeError

      // Submit prospect
      const { error } = await supabase
        .from('prospects')
        .insert({
          name,
          email,
          phone,
          message,
          property_id: propertyId,
          property_name: propertyName,
          area_code: areaCodeData?.areaCode,
          country: areaCodeData?.country
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      })

      // Reset form
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (error) {
      console.error('Error submitting contact form:', error)
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Your Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Message
      </Button>
    </form>
  )
}
