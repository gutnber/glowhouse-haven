
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { UserPlus } from "lucide-react"

const crearUsuarioSchema = z.object({
  nombre_completo: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  estado: z.enum(["nuevo", "contactado", "interesado", "bajo_contrato", "cliente", "inactivo"]),
  fuente: z.enum(["sitio_web", "referido", "redes_sociales", "publicidad", "evento", "otro"]),
  propiedad_interes: z.string().optional(),
  presupuesto_min: z.string().optional(),
  presupuesto_max: z.string().optional(),
  notas: z.string().optional(),
  agente_asignado: z.string().optional(),
  prioridad: z.enum(["1", "2", "3", "4", "5"]),
})

interface CrearUsuarioDialogProps {
  onUsuarioCreado: () => Promise<void>
}

export const CrearUsuarioDialog = ({ onUsuarioCreado }: CrearUsuarioDialogProps) => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<z.infer<typeof crearUsuarioSchema>>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues: {
      nombre_completo: "",
      email: "",
      telefono: "",
      estado: "nuevo",
      fuente: "sitio_web",
      propiedad_interes: "",
      presupuesto_min: "",
      presupuesto_max: "",
      notas: "",
      agente_asignado: "",
      prioridad: "3",
    },
  })

  const handleCrearUsuario = async (values: z.infer<typeof crearUsuarioSchema>) => {
    try {
      const { data, error } = await supabase
        .from("gestion_usuarios")
        .insert({
          nombre_completo: values.nombre_completo,
          email: values.email || null,
          telefono: values.telefono || null,
          estado: values.estado,
          fuente: values.fuente,
          propiedad_interes: values.propiedad_interes || null,
          presupuesto_min: values.presupuesto_min ? parseFloat(values.presupuesto_min) : null,
          presupuesto_max: values.presupuesto_max ? parseFloat(values.presupuesto_max) : null,
          notas: values.notas || null,
          agente_asignado: values.agente_asignado || null,
          prioridad: parseInt(values.prioridad),
        })

      if (error) throw error

      await onUsuarioCreado()
      setIsOpen(false)
      form.reset()
      toast({
        title: "Éxito",
        description: "Usuario creado exitosamente",
      })
    } catch (error) {
      console.error("Error creating usuario:", error)
      toast({
        title: "Error",
        description: "Error al crear usuario",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Crear Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCrearUsuario)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo *</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agente_asignado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agente Asignado</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nuevo">Nuevo</SelectItem>
                        <SelectItem value="contactado">Contactado</SelectItem>
                        <SelectItem value="interesado">Interesado</SelectItem>
                        <SelectItem value="bajo_contrato">Bajo Contrato</SelectItem>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sitio_web">Sitio Web</SelectItem>
                        <SelectItem value="referido">Referido</SelectItem>
                        <SelectItem value="redes_sociales">Redes Sociales</SelectItem>
                        <SelectItem value="publicidad">Publicidad</SelectItem>
                        <SelectItem value="evento">Evento</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prioridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Muy Alta</SelectItem>
                        <SelectItem value="2">2 - Alta</SelectItem>
                        <SelectItem value="3">3 - Media</SelectItem>
                        <SelectItem value="4">4 - Baja</SelectItem>
                        <SelectItem value="5">5 - Muy Baja</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="propiedad_interes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propiedad de Interés</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="presupuesto_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto Mínimo (USD)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presupuesto_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto Máximo (USD)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Crear Usuario</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
