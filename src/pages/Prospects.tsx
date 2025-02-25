
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { Navigate } from "react-router-dom"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader } from "@/components/ui/loader"

const Prospects = () => {
  const { isAdmin } = useIsAdmin()

  const { data: prospects, isLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-20">
        <Loader className="mx-auto" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prospects</h1>
        <p className="text-muted-foreground">Manage your leads and inquiries</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Area Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects?.map((prospect) => (
              <TableRow key={prospect.id}>
                <TableCell>
                  {format(new Date(prospect.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{prospect.name}</TableCell>
                <TableCell>{prospect.email}</TableCell>
                <TableCell>{prospect.phone}</TableCell>
                <TableCell>{prospect.area_code || '-'}</TableCell>
                <TableCell>{prospect.country || '-'}</TableCell>
                <TableCell>{prospect.property_name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {prospect.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Prospects
