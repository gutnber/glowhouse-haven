
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const agregarContactoSchema = z.object({
  tipo_contacto: z.string().min(1, "Tipo de contacto es requerido"),
  descripcion: z.string().min(1, "Descripción es requerida"),
  resultado: z.string().optional(),
  fecha_contacto: z.string(),
  proximo_seguimiento: z.string().optional(),
  creado_por: z.string().optional(),
})

interface AgregarContactoFormProps {
  usuarioId: string
  onContactoAgregado: () => void
}

export const AgregarContactoForm = ({ usuarioId, onContactoAgregado }: AgregarContactoFormProps) => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof agregarContactoSchema>>({
    resolver: zodResolver(agregarContactoSchema),
    defaultValues: {
      tipo_contacto: "",
      descripcion: "",
      resultado: "",
      fecha_contacto: new Date().toISOString().split('T')[0],
      proximo_seguimiento: "",
      creado_por: "",
    },
  })

  const handleAgregarContacto = async (values: z.infer<typeof agregarContactoSchema>) => {
    try {
      const { error } = await supabase
        .from("historial_contactos")
        .insert({
          usuario_id: usuarioId,
          tipo_contacto: values.tipo_contacto,
          descripcion: values.descripcion,
          resultado: values.resultado || null,
          fecha_contacto: new Date(values.fecha_contacto).toISOString(),
          proximo_seguimiento: values.proximo_seguimiento ? 
            new Date(values.proximo_seguimiento).toISOString() : null,
          creado_por: values.creado_por || null,
        })

      if (error) throw error

      // Update last contact date in main table
      await supabase
        .from("gestion_usuarios")
        .update({ fecha_ultimo_contacto: new Date().toISOString() })
        .eq("id", usuarioId)

      onContactoAgregado()
      form.reset()
      toast({
        title: "Éxito",
        description: "Contacto agregado exitosamente",
      })
    } catch (error) {
      console.error("Error adding contacto:", error)
      toast({
        title: "Error",
        description: "Error al agregar contacto",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium mb-4">Agregar Nuevo Contacto</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAgregarContacto)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipo_contacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Contacto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="llamada">Llamada</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="reunion">Reunión</SelectItem>
                      <SelectItem value="visita">Visita</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resultado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar resultado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exitoso">Exitoso</SelectItem>
                      <SelectItem value="sin_respuesta">Sin respuesta</SelectItem>
                      <SelectItem value="reagendar">Reagendar</SelectItem>
                      <SelectItem value="no_interesado">No interesado</SelectItem>
                      <SelectItem value="interesado">Interesado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fecha_contacto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Contacto</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proximo_seguimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próximo Seguimiento</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="creado_por"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creado Por</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nombre del agente" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Agregar Contacto</Button>
        </form>
      </Form>
    </div>
  )
}
