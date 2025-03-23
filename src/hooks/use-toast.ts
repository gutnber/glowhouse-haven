
import * as React from "react"
import { toast as sonnerToast } from "sonner"

// Define the proper types for sonner toast
interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
  variant?: "default" | "destructive"
  type?: "normal" | "success" | "error" | "loading"
  id?: string
  className?: string
  // Add other sonner properties as needed
}

// Function to get toasts from the DOM
// This is a workaround since sonner doesn't export a useToaster hook
function useToasts() {
  const [toasts, setToasts] = React.useState<any[]>([])
  
  React.useEffect(() => {
    // Get toasts from the DOM
    const updateToasts = () => {
      const toastElements = document.querySelectorAll('[data-sonner-toast]')
      const toastsArray = Array.from(toastElements).map(el => {
        const id = el.getAttribute('data-sonner-toast')
        const title = el.querySelector('[data-sonner-title]')?.textContent || ''
        return { id: id || Math.random().toString(), title }
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
    ({ variant = "default", ...props }: ToastOptions) => {
      // Convert our variant to sonner's type if needed
      const type = variant === "destructive" ? "error" : "default";
      
      // Pass options correctly to sonner
      return sonnerToast(props.title as string, {
        ...props,
        type,
      })
    },
    []
  )

  return { toast, toasts }
}

// This is for direct access without the hook
export const toast = ({ variant = "default", ...props }: ToastOptions) => {
  // Convert our variant to sonner's type if needed
  const type = variant === "destructive" ? "error" : "default";
  
  // Pass options correctly to sonner
  return sonnerToast(props.title as string, {
    ...props,
    type,
  })
}
