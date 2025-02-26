
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
  const { isAdmin, isLoading: isAdminCheckLoading } = useIsAdmin()

  const { data: contacts, isLoading: isContactsLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts_export')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: isAdmin
  })

  if (isAdminCheckLoading) {
    return (
      <div className="container mx-auto py-20">
        <Loader className="mx-auto" />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  if (isContactsLoading) {
    return (
      <div className="container mx-auto py-20">
        <Loader className="mx-auto" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
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
              <TableHead>Property</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  {format(new Date(contact.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{contact.full_name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.inquiry_property_name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {contact.contact_message}
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

