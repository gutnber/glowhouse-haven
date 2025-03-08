
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null, currency?: string): string {
  if (amount === null || amount === undefined) return currency === "MXN" ? "MX$0 MXN" : "$0 USD"
  
  const currencySymbol = currency === "MXN" ? "MX$" : "$"
  const currencyCode = currency === "MXN" ? "MXN" : "USD"
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
  
  return `${currencySymbol}${formattedAmount} ${currencyCode}`
}
