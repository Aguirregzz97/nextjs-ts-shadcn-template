import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes, resolving conflicts (verifies lint-staged eslint/prettier on .ts files)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
