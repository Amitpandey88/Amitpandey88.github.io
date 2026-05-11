import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-lg place-content-center space-y-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-zinc-500 dark:text-zinc-400">We couldn’t find that page in NoteMesh.</p>
      <Link href="/notes" className="text-indigo-600 hover:underline dark:text-indigo-300">Go to notes</Link>
    </main>
  );
}
