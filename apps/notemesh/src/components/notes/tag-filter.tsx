interface Tag {
  id: string;
  name: string;
  color: string;
}

export function TagFilter({ tags, selected, onSelect }: { tags: Tag[]; selected: string; onSelect: (tag: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onSelect("")} className={`rounded-full px-3 py-1 text-xs ${selected ? "bg-zinc-200 dark:bg-zinc-800" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"}`}>All</button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onSelect(tag.name)}
          className={`rounded-full border px-3 py-1 text-xs ${selected === tag.name ? "border-transparent bg-indigo-600 text-white" : "border-zinc-300 dark:border-zinc-700"}`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
