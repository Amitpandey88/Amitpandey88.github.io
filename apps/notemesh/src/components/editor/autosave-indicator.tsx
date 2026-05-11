export function AutosaveIndicator({ isSaving }: { isSaving: boolean }) {
  return <p className="text-xs text-zinc-500 dark:text-zinc-400">{isSaving ? "Saving…" : "All changes saved"}</p>;
}
