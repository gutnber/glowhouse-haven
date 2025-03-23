
import { ReactNode } from "react";

declare module "@/hooks/use-toast" {
  interface ToastOptions {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    icon?: ReactNode;
    variant?: "default" | "destructive";
  }
}
