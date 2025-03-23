
import { ReactNode } from "react";

declare module "@/hooks/use-toast" {
  interface ToastProps {
    icon?: ReactNode;
    variant?: "default" | "destructive";
  }
}
