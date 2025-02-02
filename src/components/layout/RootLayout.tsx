import { TopNavigation } from "./TopNavigation"
import { Outlet } from "react-router-dom"

export const RootLayout = () => {
  return (
    <div className="min-h-screen">
      <TopNavigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}