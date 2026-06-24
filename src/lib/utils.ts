import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const datePart = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const timePart = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${datePart}, ${timePart}`
}

export function calculateAdminFee(amount: number): number {
  return amount < 5_000_000 ? 2500 : 5000
}
