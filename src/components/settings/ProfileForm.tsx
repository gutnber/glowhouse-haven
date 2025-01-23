import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { NameField } from "./form-fields/NameField"
import { EmailField } from "./form-fields/EmailField"
import { PhoneField } from "./form-fields/PhoneField"
import { CompanyField } from "./form-fields/CompanyField"

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  company: z.string().optional(),
  avatar_url: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialValues: ProfileFormValues
  onSubmit: (values: ProfileFormValues) => Promise<void>
  isLoading: boolean
}

export function ProfileForm({ initialValues, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialValues,
      avatar_url: initialValues.avatar_url || '',
    },
  })

  console.log('Form initial values:', initialValues)

  const handleSubmit = async (values: ProfileFormValues) => {
    console.log('Submitting form with values:', values)
    await onSubmit({
      ...values,
      avatar_url: values.avatar_url || initialValues.avatar_url,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <NameField form={form} />
        <EmailField form={form} />
        <PhoneField form={form} />
        <CompanyField form={form} />
        
        {/* Hidden field for avatar_url */}
        <input type="hidden" {...form.register('avatar_url')} />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  )
}