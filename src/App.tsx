import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import RootLayout from "@/components/layout/RootLayout"
import Index from "@/pages/Index"
import Properties from "@/pages/Properties"
import AddProperty from "@/pages/AddProperty"

const queryClient = new QueryClient()

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route
            element={<RootLayout />}
          >
            <Route
              path="/"
              element={<Index />}
            />
            <Route
              path="/properties"
              element={<Properties />}
            />
            <Route
              path="/properties/add"
              element={<AddProperty />}
            />
          </Route>
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
)

export default App