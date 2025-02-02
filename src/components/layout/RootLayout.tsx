import { TopNavigation } from "./TopNavigation"
import { Outlet } from "react-router-dom"

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}