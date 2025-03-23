
import * as React from "react"
import {
  toast as sonnerToast,
  useToaster,
  type ToastT,
} from "sonner"

// Extend the toast type
type ToastProps = ToastT & {
  variant?: "default" | "destructive"
}

// Custom hook that provides both toast function and toasts array
export function useToast() {
  const { toasts } = useToaster()
  
  const toast = React.useCallback(
    ({ variant = "default", ...props }: ToastProps) => {
      return sonnerToast(props)
    },
    []
  )

  return { toast, toasts }
}

// This is for direct access without the hook
export const toast = ({ variant = "default", ...props }: ToastProps) => {
  return sonnerToast(props)
}
