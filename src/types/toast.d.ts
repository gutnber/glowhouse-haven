
import { ReactNode } from "react";
import { ToastT } from "sonner";

declare module "@/hooks/use-toast" {
  // Ensure these match the types expected by the Radix UI Toast component
  type ToastTypes = "foreground" | "background";
  
  interface ToastOptions {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    icon?: ReactNode;
    variant?: "default" | "destructive";
    className?: string;
    duration?: number;
    id?: string;
  }
  
  interface Toast extends ToastOptions {
    id: string;
  }
}
