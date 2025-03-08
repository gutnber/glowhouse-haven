
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null, currency?: string): string {
  if (amount === null) return '$0'
  
  const currencySymbol = currency === "MXN" ? "MX$" : "$"
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === "MXN" ? "MXN" : "USD",
    currencyDisplay: 'symbol'
  }).format(amount)
  
  // Return the formatted amount, but replace the currency symbol from the formatter 
  // with our custom one to be consistent across the application
  return currencySymbol + formattedAmount.substring(formattedAmount.indexOf('$') + 1)
}
