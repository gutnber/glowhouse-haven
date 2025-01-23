import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import RootLayout from "./components/layout/RootLayout"
import Index from "./pages/Index"
import Properties from "./pages/Properties"
import AddProperty from "./pages/AddProperty"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <RootLayout>
              <Routes>
                <Route index element={<Index />} />
                <Route path="properties" element={<Properties />} />
                <Route path="add-property" element={<AddProperty />} />
              </Routes>
            </RootLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App