import { readingTimeMinutes, wordCount } from "@/lib/utils";

export function WordStats({ content }: { content: string }) {
  const words = wordCount(content);
  const readingTime = readingTimeMinutes(content);

  return (
    <div className="text-xs text-zinc-500 dark:text-zinc-400">
      {words} words • {readingTime} min read
    </div>
  );
}
