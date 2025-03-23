
import * as React from "react"
import { toast as sonnerToast, type ToastT } from "sonner"

// Extend the toast type to include our variant
type ToastProps = Omit<ToastT, "id"> & {
  variant?: "default" | "destructive"
  icon?: React.ReactNode
}

// Function to get toasts from the DOM
// This is a workaround since sonner doesn't export a useToaster hook
function useToasts() {
  const [toasts, setToasts] = React.useState<ToastT[]>([])
  
  React.useEffect(() => {
    // Get toasts from the DOM
    const updateToasts = () => {
      const toastElements = document.querySelectorAll('[data-sonner-toast]')
      const toastsArray = Array.from(toastElements).map(el => {
        const id = el.getAttribute('data-sonner-toast')
        const title = el.querySelector('[data-sonner-title]')?.textContent || ''
        return { id: id || Math.random().toString() } as ToastT
      })
      setToasts(toastsArray)
    }
    
    // Create observer to watch for toast changes
    const observer = new MutationObserver(updateToasts)
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    })
    
    // Initial check
    updateToasts()
    
    return () => observer.disconnect()
  }, [])
  
  return toasts
}

// Custom hook that provides both toast function and toasts array
export function useToast() {
  const toasts = useToasts()
  
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
