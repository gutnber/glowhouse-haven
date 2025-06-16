
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface EstadoSelectProps {
  usuarioId: string
  estadoActual: string
  onEstadoUpdate: () => Promise<void>
}

const getEstadoBadgeColor = (estado: string) => {
  switch (estado) {
    case 'nuevo': return 'bg-blue-100 text-blue-800'
    case 'contactado': return 'bg-yellow-100 text-yellow-800'
    case 'interesado': return 'bg-green-100 text-green-800'
    case 'bajo_contrato': return 'bg-purple-100 text-purple-800'
    case 'cliente': return 'bg-emerald-100 text-emerald-800'
    case 'inactivo': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getEstadoLabel = (estado: string) => {
  switch (estado) {
    case 'nuevo': return 'Nuevo'
    case 'contactado': return 'Contactado'
    case 'interesado': return 'Interesado'
    case 'bajo_contrato': return 'Bajo Contrato'
    case 'cliente': return 'Cliente'
    case 'inactivo': return 'Inactivo'
    default: return estado
  }
}

export const EstadoSelect = ({ usuarioId, estadoActual, onEstadoUpdate }: EstadoSelectProps) => {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEstadoChange = async (nuevoEstado: string) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("gestion_usuarios")
        .update({ 
          estado: nuevoEstado,
          fecha_ultimo_contacto: new Date().toISOString()
        })
        .eq("id", usuarioId)

      if (error) throw error

      await onEstadoUpdate()
      toast({
        title: "Éxito",
        description: "Estado actualizado exitosamente",
      })
    } catch (error) {
      console.error("Error updating estado:", error)
      toast({
        title: "Error",
        description: "Error al actualizar estado",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      disabled={isUpdating}
      value={estadoActual}
      onValueChange={handleEstadoChange}
    >
      <SelectTrigger className="w-40">
        <SelectValue>
          <Badge className={getEstadoBadgeColor(estadoActual)}>
            {getEstadoLabel(estadoActual)}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nuevo">Nuevo</SelectItem>
        <SelectItem value="contactado">Contactado</SelectItem>
        <SelectItem value="interesado">Interesado</SelectItem>
        <SelectItem value="bajo_contrato">Bajo Contrato</SelectItem>
        <SelectItem value="cliente">Cliente</SelectItem>
        <SelectItem value="inactivo">Inactivo</SelectItem>
      </SelectContent>
    </Select>
  )
}
