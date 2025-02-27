
import { useState, useEffect } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Trash2, MoreVertical, CheckCircle, Clock, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  created_at: string
}

export function ContactSubmissionsTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contact submissions:', error)
        toast({
          title: "Error",
          description: "Failed to load contact submissions.",
          variant: "destructive",
        })
      } else {
        setSubmissions(data || [])
      }
    } catch (error) {
      console.error('Error in fetchSubmissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting submission:', error)
        toast({
          title: "Error",
          description: "Failed to delete submission.",
          variant: "destructive",
        })
      } else {
        setSubmissions(submissions.filter(sub => sub.id !== id))
        toast({
          title: "Success",
          description: "Submission deleted successfully.",
        })
      }
    } catch (error) {
      console.error('Error in handleDelete:', error)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id)

      if (error) {
        console.error('Error updating submission status:', error)
        toast({
          title: "Error",
          description: "Failed to update status.",
          variant: "destructive",
        })
      } else {
        setSubmissions(submissions.map(sub => 
          sub.id === id ? { ...sub, status } : sub
        ))
        toast({
          title: "Success",
          description: `Status updated to ${status}.`,
        })
      }
    } catch (error) {
      console.error('Error in updateStatus:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>
      case 'completed':
        return <Badge variant="success" className="bg-green-500">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-4">No contact form submissions found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto font-normal hover:underline"
                      onClick={() => handleEmailClick(submission.email)}
                    >
                      {submission.email}
                    </Button>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={submission.message}>
                    {submission.message}
                  </TableCell>
                  <TableCell>{formatDate(submission.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEmailClick(submission.email)}
                        title="Reply via email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'new')}>
                            <Badge variant="default" className="mr-2">New</Badge> Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'in-progress')}>
                            <Clock className="h-4 w-4 mr-2" /> Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'completed')}>
                            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive" 
                            onClick={() => handleDelete(submission.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
