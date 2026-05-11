export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description ? <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p> : null}
    </header>
  );
}
