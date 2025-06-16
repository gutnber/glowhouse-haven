
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, TrendingUp, DollarSign } from "lucide-react"

interface Usuario {
  estado: string
  presupuesto_min: number | null
  presupuesto_max: number | null
}

interface EstadisticasUsuariosProps {
  usuarios: Usuario[]
}

export const EstadisticasUsuarios = ({ usuarios }: EstadisticasUsuariosProps) => {
  const estadisticas = {
    total: usuarios.length,
    nuevos: usuarios.filter(u => u.estado === 'nuevo').length,
    contactados: usuarios.filter(u => u.estado === 'contactado').length,
    interesados: usuarios.filter(u => u.estado === 'interesado').length,
    bajoContrato: usuarios.filter(u => u.estado === 'bajo_contrato').length,
    clientes: usuarios.filter(u => u.estado === 'cliente').length,
    inactivos: usuarios.filter(u => u.estado === 'inactivo').length,
  }

  const presupuestoPromedio = usuarios
    .filter(u => u.presupuesto_max)
    .reduce((sum, u) => sum + (u.presupuesto_max || 0), 0) / 
    usuarios.filter(u => u.presupuesto_max).length || 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nuevos</CardTitle>
          <div className="h-3 w-3 bg-blue-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.nuevos}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contactados</CardTitle>
          <div className="h-3 w-3 bg-yellow-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.contactados}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interesados</CardTitle>
          <div className="h-3 w-3 bg-green-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.interesados}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bajo Contrato</CardTitle>
          <div className="h-3 w-3 bg-purple-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.bajoContrato}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes</CardTitle>
          <div className="h-3 w-3 bg-emerald-500 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.clientes}</div>
        </CardContent>
      </Card>
    </div>
  )
}
