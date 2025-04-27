import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  // Assuming price is stored in cents, convert to actual KES price
  // For a more realistic price, divide by 100 and round to whole KES
  const actualPrice = Math.round(price / 100);
  
  // Format with KES currency symbol
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(actualPrice);
}
