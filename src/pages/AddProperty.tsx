import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import * as z from "zod"
import { Building2, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const propertyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be 0 or more"),
  build_year: z.coerce.number().min(1800, "Build year must be 1800 or later").max(new Date().getFullYear(), "Build year cannot be in the future"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  arv: z.coerce.number().positive("ARV must be greater than 0").optional(),
  features: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

const AddProperty = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      build_year: new Date().getFullYear(),
      description: "",
      price: 0,
      arv: undefined,
      features: "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      const propertyData = {
        ...values,
        features: values.features, // This is now correctly typed as string[]
      }
      
      const { error } = await supabase
        .from('properties')
        .insert([propertyData])
      
      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Property has been added successfully",
      })
      navigate('/properties')
    },
    onError: (error) => {
      console.error('Error adding property:', error)
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: PropertyFormValues) => {
    mutation.mutate(values)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Add New Property</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="build_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build Year</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ARV (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>After Repair Value</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Input placeholder="Garage, Pool, etc. (comma-separated)" {...field} />
                  </FormControl>
                  <FormDescription>Enter features separated by commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter property description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Property
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AddProperty