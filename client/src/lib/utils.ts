import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  } catch (error) {
    return dateString;
  }
}

export function formatPrice(price: string | null | undefined): string {
  if (!price) return "-";
  
  // If price already has ¥ symbol, return as-is
  if (price.includes("¥")) return price;
  
  // Try to format as number
  const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ""));
  if (isNaN(numericPrice)) return price;
  
  return `¥${numericPrice.toLocaleString("ja-JP")}`;
}
