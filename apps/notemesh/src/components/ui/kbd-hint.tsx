export function KbdHint({ text }: { text: string }) {
  return <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700">{text}</kbd>;
}
