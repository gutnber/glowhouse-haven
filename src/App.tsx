import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import RootLayout from "@/components/layout/RootLayout"
import Index from "@/pages/Index"
import Properties from "@/pages/Properties"
import AddProperty from "@/pages/AddProperty"
import EditProperty from "@/pages/EditProperty"
import PropertyProfile from "@/pages/PropertyProfile"
import Users from "@/pages/Users"

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/properties/:id/edit" element={<EditProperty />} />
          <Route path="/properties/:id" element={<PropertyProfile />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </TooltipProvider>
  )
}

export default App