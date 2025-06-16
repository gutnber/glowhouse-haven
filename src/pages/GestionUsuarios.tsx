
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { Loader2, Users, UserPlus } from "lucide-react"
import { CrearUsuarioDialog } from "@/components/gestion-usuarios/CrearUsuarioDialog"
import { TablaUsuarios } from "@/components/gestion-usuarios/TablaUsuarios"
import { EstadisticasUsuarios } from "@/components/gestion-usuarios/EstadisticasUsuarios"

const GestionUsuarios = () => {
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin()

  const { data: usuarios, isLoading: isUsuariosLoading, refetch } = useQuery({
    queryKey: ["gestion-usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gestion_usuarios")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) {
        console.error("Error fetching usuarios:", error)
        throw error
      }
      
      return data || []
    },
    enabled: isAdmin,
  })

  if (isAdminLoading || isUsuariosLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Users className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Acceso de Administrador Requerido</h1>
        <p className="text-muted-foreground">
          Necesitas privilegios de administrador para ver esta página.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <CrearUsuarioDialog onUsuarioCreado={refetch} />
      </div>

      <EstadisticasUsuarios usuarios={usuarios || []} />
      
      <TablaUsuarios
        usuarios={usuarios || []}
        onRefetch={refetch}
      />
    </div>
  )
}

export default GestionUsuarios
