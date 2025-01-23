import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import RootLayout from "@/components/layout/RootLayout"
import Index from "@/pages/Index"
import Properties from "@/pages/Properties"
import PropertyProfile from "@/pages/PropertyProfile"
import AddProperty from "@/pages/AddProperty"
import EditProperty from "@/pages/EditProperty"
import Users from "@/pages/Users"
import Settings from "@/pages/Settings"
import Tools from "@/pages/Tools"

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/add" element={<AddProperty />} />
          <Route path="/properties/:id/edit" element={<EditProperty />} />
          <Route path="/properties/:id" element={<PropertyProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tools" element={<Tools />} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}

export default App