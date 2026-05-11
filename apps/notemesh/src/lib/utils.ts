import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72);
}

export function excerptFromMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/[>#*_\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export function wordCount(content: string): number {
  const cleaned = content.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).length;
}

export function readingTimeMinutes(content: string): number {
  return Math.max(1, Math.ceil(wordCount(content) / 200));
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleString();
}
