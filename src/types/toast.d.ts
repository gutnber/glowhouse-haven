
import { ReactNode } from "react";
import { ToastT } from "sonner";

declare module "@/hooks/use-toast" {
  type ToastTypes = "success" | "error" | "loading" | "default";
  
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
