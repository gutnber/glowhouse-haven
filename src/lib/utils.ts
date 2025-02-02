import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatArea(area: number): string {
  if (!area) return '0 m²'
  return `${area.toLocaleString()} m²`
}