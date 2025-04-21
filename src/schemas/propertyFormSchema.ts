
import * as z from "zod"

export const propertyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  build_year: z.number().min(1800).max(new Date().getFullYear()),
  price: z.number().min(0),
  price_per_sqm: z.number().min(0).optional().nullable(),
  currency: z.string().default("USD"),
  arv: z.number().min(0).optional().nullable(),
  width: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.union([
    z.array(z.string()), 
    z.string().transform(str => 
      str ? str.split(',').map(s => s.trim()).filter(s => s.length > 0) : []
    )
  ]),
  google_maps_url: z.string().optional().nullable(),
  youtube_url: z.string().optional().nullable(),
  youtube_autoplay: z.boolean().optional().nullable(),
  youtube_muted: z.boolean().optional().nullable(),
  youtube_controls: z.boolean().optional().nullable(),
  enable_border_beam: z.boolean().optional().nullable(),
  property_type: z.string(),
  mode: z.string(),
  status: z.string(),
  area: z.number().min(0).optional().nullable(),
  heated_area: z.number().min(0).optional().nullable(),
  reference_number: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>
