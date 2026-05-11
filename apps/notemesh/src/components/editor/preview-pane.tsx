import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function PreviewPane({ content }: { content: string }) {
  return (
    <div className="prose-preview h-[60vh] overflow-auto rounded-b-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content || "_Nothing to preview yet._"}</ReactMarkdown>
    </div>
  );
}
