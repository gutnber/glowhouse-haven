
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null, currency?: string): string {
  if (amount === null || amount === undefined) return currency === "MXN" ? "MX$0" : "$0"
  
  const currencySymbol = currency === "MXN" ? "MX$" : "$"
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
  
  return `${currencySymbol}${formattedAmount}`
}
