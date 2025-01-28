import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, Home, Newspaper, Building2, Users2, Wrench } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Newspaper, label: "News", path: "/news" },
  { icon: Building2, label: "Properties", path: "/properties" },
  { icon: Users2, label: "Users", path: "/users" },
  { icon: Wrench, label: "Tools", path: "/tools" },
]

export default function RootLayout() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const location = useLocation()

  useState(() => {
    setMounted(true)
  })

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border/50 pb-4 backdrop-blur-md bg-white/10">
            <div className="flex flex-col gap-2 px-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 h-8 w-8 group transition-all duration-300"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 transition-all duration-300 rotate-0 scale-100 group-hover:rotate-90 group-hover:scale-110" />
                ) : (
                  <Moon className="h-4 w-4 transition-all duration-300 rotate-0 scale-100 group-hover:-rotate-90 group-hover:scale-110" />
                )}
              </Button>
              <div className="h-4" />
              <h2 className="text-lg font-semibold bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/70 bg-clip-text text-transparent">
                Glowhouse Haven
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "w-full group relative overflow-hidden",
                      "transition-all duration-300 ease-out",
                      "backdrop-blur-sm bg-white/5 dark:bg-black/5",
                      "hover:bg-white/10 dark:hover:bg-white/10",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-sidebar-primary/20 before:to-transparent",
                      "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
                      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left",
                      "after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300",
                      "after:bg-gradient-to-r after:from-sidebar-primary/50 after:via-sidebar-primary after:to-sidebar-primary/50",
                      "rounded-lg shadow-sm",
                      location.pathname === item.path && "bg-sidebar-accent/50 shadow-md"
                    )}
                  >
                    <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className={cn(
                        "h-4 w-4 transition-all duration-300",
                        "group-hover:text-sidebar-primary group-hover:scale-110",
                        location.pathname === item.path ? "text-sidebar-primary" : "text-sidebar-foreground/70"
                      )} />
                      <span className={cn(
                        "text-sm transition-all duration-300",
                        "group-hover:text-sidebar-primary group-hover:translate-x-1",
                        location.pathname === item.path ? "text-sidebar-primary font-medium" : "text-sidebar-foreground/70"
                      )}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border/50 backdrop-blur-md bg-white/10">
            <p className="text-xs text-sidebar-foreground/50 text-center">
              © 2024 Glowhouse Haven
            </p>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-x-hidden">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}