
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EstadoSelect } from "./EstadoSelect"
import { HistorialContactosDialog } from "./HistorialContactosDialog"
import { Eye, Phone, Mail, Edit, Trash } from "lucide-react"
import { format } from "date-fns"

type EstadoUsuario = 'nuevo' | 'contactado' | 'interesado' | 'bajo_contrato' | 'cliente' | 'inactivo'

interface Usuario {
  id: string
  nombre_completo: string
  email: string | null
  telefono: string | null
  estado: EstadoUsuario
  fuente: string | null
  propiedad_interes: string | null
  presupuesto_min: number | null
  presupuesto_max: number | null
  notas: string | null
  fecha_primer_contacto: string | null
  fecha_ultimo_contacto: string | null
  fecha_siguiente_seguimiento: string | null
  agente_asignado: string | null
  prioridad: number | null
  tags: string[] | null
  created_at: string
}

interface TablaUsuariosProps {
  usuarios: Usuario[]
  onRefetch: () => Promise<void>
}

const getEstadoBadgeColor = (estado: EstadoUsuario) => {
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

const getPrioridadColor = (prioridad: number) => {
  switch (prioridad) {
    case 1: return 'bg-red-100 text-red-800'
    case 2: return 'bg-orange-100 text-orange-800'
    case 3: return 'bg-yellow-100 text-yellow-800'
    case 4: return 'bg-blue-100 text-blue-800'
    case 5: return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const TablaUsuarios = ({ usuarios, onRefetch }: TablaUsuariosProps) => {
  const { toast } = useToast()
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideBusqueda = usuario.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            usuario.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
                            usuario.telefono?.includes(busqueda)
    
    const coincideEstado = filtroEstado === "todos" || usuario.estado === filtroEstado
    
    return coincideBusqueda && coincideEstado
  })

  const handleEliminarUsuario = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return

    try {
      const { error } = await supabase
        .from("gestion_usuarios")
        .delete()
        .eq("id", id)

      if (error) throw error

      await onRefetch()
      toast({
        title: "Éxito",
        description: "Usuario eliminado exitosamente",
      })
    } catch (error) {
      console.error("Error deleting usuario:", error)
      toast({
        title: "Error",
        description: "Error al eliminar usuario",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="nuevo">Nuevo</SelectItem>
            <SelectItem value="contactado">Contactado</SelectItem>
            <SelectItem value="interesado">Interesado</SelectItem>
            <SelectItem value="bajo_contrato">Bajo Contrato</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Presupuesto</TableHead>
              <TableHead>Agente</TableHead>
              <TableHead>Último Contacto</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{usuario.nombre_completo}</div>
                    {usuario.propiedad_interes && (
                      <div className="text-sm text-muted-foreground">
                        Interés: {usuario.propiedad_interes}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {usuario.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {usuario.email}
                      </div>
                    )}
                    {usuario.telefono && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {usuario.telefono}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <EstadoSelect
                    usuarioId={usuario.id}
                    estadoActual={usuario.estado}
                    onEstadoUpdate={onRefetch}
                  />
                </TableCell>
                <TableCell>
                  {usuario.prioridad && (
                    <Badge className={getPrioridadColor(usuario.prioridad)}>
                      {usuario.prioridad}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {(usuario.presupuesto_min || usuario.presupuesto_max) && (
                    <div className="text-sm">
                      {usuario.presupuesto_min && `$${usuario.presupuesto_min.toLocaleString()}`}
                      {usuario.presupuesto_min && usuario.presupuesto_max && " - "}
                      {usuario.presupuesto_max && `$${usuario.presupuesto_max.toLocaleString()}`}
                    </div>
                  )}
                </TableCell>
                <TableCell>{usuario.agente_asignado || "-"}</TableCell>
                <TableCell>
                  {usuario.fecha_ultimo_contacto && (
                    <div className="text-sm">
                      {format(new Date(usuario.fecha_ultimo_contacto), "dd/MM/yyyy")}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <HistorialContactosDialog usuarioId={usuario.id} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminarUsuario(usuario.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {usuariosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
