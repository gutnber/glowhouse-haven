
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Plus } from "lucide-react"
import { AgregarContactoForm } from "./AgregarContactoForm"
import { format } from "date-fns"

interface HistorialContactosDialogProps {
  usuarioId: string
}

export const HistorialContactosDialog = ({ usuarioId }: HistorialContactosDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const { data: historial, isLoading, refetch } = useQuery({
    queryKey: ["historial-contactos", usuarioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("historial_contactos")
        .select("*")
        .eq("usuario_id", usuarioId)
        .order("fecha_contacto", { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: isOpen,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Historial de Contactos
            <Button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Contacto
            </Button>
          </DialogTitle>
        </DialogHeader>

        {mostrarFormulario && (
          <AgregarContactoForm
            usuarioId={usuarioId}
            onContactoAgregado={() => {
              refetch()
              setMostrarFormulario(false)
            }}
          />
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div>Cargando historial...</div>
          ) : historial?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay contactos registrados
            </div>
          ) : (
            historial?.map((contacto) => (
              <div key={contacto.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="font-medium">{contacto.tipo_contacto}</span>
                    {contacto.resultado && (
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {contacto.resultado}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(contacto.fecha_contacto), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <p className="text-sm mb-2">{contacto.descripcion}</p>
                {contacto.proximo_seguimiento && (
                  <div className="text-sm text-muted-foreground">
                    Próximo seguimiento: {format(new Date(contacto.proximo_seguimiento), "dd/MM/yyyy")}
                  </div>
                )}
                {contacto.creado_por && (
                  <div className="text-sm text-muted-foreground">
                    Por: {contacto.creado_por}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
