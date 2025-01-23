import { Routes, Route } from "react-router-dom"
import RootLayout from "@/components/layout/RootLayout"
import Index from "@/pages/Index"
import Properties from "@/pages/Properties"
import PropertyProfile from "@/pages/PropertyProfile"
import AddProperty from "@/pages/AddProperty"
import EditProperty from "@/pages/EditProperty"
import Users from "@/pages/Users"
import Settings from "@/pages/Settings"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyProfile />} />
        <Route path="/properties/add" element={<AddProperty />} />
        <Route path="/properties/:id/edit" element={<EditProperty />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App