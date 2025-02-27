
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Phone, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import type { ContactSubmission } from "@/types/communications"
import { useToast } from "@/hooks/use-toast"

export function ContactSubmissionsTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast({
        title: "Error",
        description: "Failed to load contact submissions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id)
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id)

      if (error) throw error
      
      setSubmissions(prev => prev.filter(sub => sub.id !== id))
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting submission:", error)
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error
      
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status: newStatus } : sub
      ))
      
      toast({
        title: "Success",
        description: "Status updated successfully",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.name}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <a href={`mailto:${submission.email}`} className="flex items-center gap-1 hover:underline">
                    <Mail className="h-4 w-4" />
                    {submission.email}
                  </a>
                  {submission.phone && (
                    <a href={`tel:${submission.phone}`} className="flex items-center gap-1 hover:underline">
                      <Phone className="h-4 w-4" />
                      {submission.phone}
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="line-clamp-2">{submission.message}</p>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(
                    submission.id, 
                    submission.status === "new" ? "read" : "new"
                  )}
                >
                  <Badge variant={submission.status === "new" ? "default" : "outline"}>
                    {submission.status}
                  </Badge>
                </Button>
              </TableCell>
              <TableCell>
                {new Date(submission.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(submission.id)}
                  disabled={deleting === submission.id}
                >
                  {deleting === submission.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
