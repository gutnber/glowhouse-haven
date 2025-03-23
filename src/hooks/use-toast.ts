
import * as React from "react"
import {
  toast as sonnerToast,
  type Toast as SonnerToast,
} from "sonner"

// Extend the type
type ToastProps = SonnerToast & {
  variant?: "default" | "destructive"
}

// This is your custom hook
export function useToast() {
  const toast = React.useCallback(
    ({ variant = "default", ...props }: ToastProps) => {
      return sonnerToast(props)
    },
    []
  )

  return { toast }
}

// This is for direct access without the hook
export const toast = ({ variant = "default", ...props }: ToastProps) => {
  return sonnerToast(props)
}
