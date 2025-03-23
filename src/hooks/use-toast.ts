
import * as React from "react"
import { toast as sonnerToast, ToastT } from "sonner"

// Define the proper types for our toast options
interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
  variant?: "default" | "destructive"
  className?: string
  duration?: number
  id?: string
}

// Use ToastT from sonner instead of the non-existent Toast type
type ToastProps = ToastT & ToastOptions;

// Function to get toasts from the DOM
// This is a workaround since sonner doesn't export a useToaster hook
function useToasts() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])
  
  React.useEffect(() => {
    // Get toasts from the DOM
    const updateToasts = () => {
      const toastElements = document.querySelectorAll('[data-sonner-toast]')
      const toastsArray = Array.from(toastElements).map(el => {
        const id = el.getAttribute('data-sonner-toast') || Math.random().toString();
        const title = el.querySelector('[data-sonner-title]')?.textContent || '';
        const description = el.querySelector('[data-sonner-description]')?.textContent || '';
        
        return { 
          id, 
          title, 
          description 
        } as ToastProps;
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
    ({ variant = "default", title, description, action, icon, className, duration, id }: ToastOptions) => {
      // Map our variant to sonner's expected options
      const options: Record<string, any> = {
        description,
        action,
        icon,
        className,
        duration,
        id
      };
      
      // Set the correct toast type based on variant
      if (variant === "destructive") {
        options.error = true;
      }
      
      // Call Sonner toast with the right parameters
      return sonnerToast(title as string, options);
    },
    []
  )

  return { toast, toasts }
}

// This is for direct access without the hook
export const toast = ({ variant = "default", title, description, action, icon, className, duration, id }: ToastOptions) => {
  // Map our variant to sonner's expected options
  const options: Record<string, any> = {
    description,
    action,
    icon,
    className,
    duration,
    id
  };
  
  // Set the correct toast type based on variant
  if (variant === "destructive") {
    options.error = true;
  }
  
  // Call Sonner toast with the right parameters
  return sonnerToast(title as string, options);
}
