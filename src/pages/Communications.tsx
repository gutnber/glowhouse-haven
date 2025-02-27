
import { useState } from "react"
import { SubscribersTable } from "@/components/admin/SubscribersTable"
import { ContactSubmissionsTable } from "@/components/admin/ContactSubmissionsTable"
import { useAuthSession } from "@/hooks/useAuthSession"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"
import { Navigate } from "react-router-dom"

export default function Communications() {
  const session = useAuthSession()
  const { isAdmin } = useIsAdmin()
  const [activeTab, setActiveTab] = useState("contacts")
  
  // Redirect non-admin users
  if (session && !isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Communications</h1>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
          <TabsTrigger value="subscribers">Newsletter Subscribers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="space-y-6">
          <ContactSubmissionsTable />
        </TabsContent>
        
        <TabsContent value="subscribers" className="space-y-6">
          <SubscribersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
