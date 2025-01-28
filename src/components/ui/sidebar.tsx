import * as React from "react"
import { SidebarProvider, useSidebar } from "./sidebar/sidebar-context"
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent 
} from "./sidebar/sidebar-components"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./sidebar/sidebar-menu"
import { Button } from "./button"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Sidebar trigger component
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

// Export all components
export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
}