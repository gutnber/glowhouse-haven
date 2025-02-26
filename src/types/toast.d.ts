
import { ReactNode } from "react";
import { Toast } from "@/hooks/use-toast";

declare module "@/hooks/use-toast" {
  interface Toast {
    icon?: ReactNode;
  }
}
