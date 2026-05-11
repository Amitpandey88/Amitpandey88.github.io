import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEMO_EMAIL ?? "demo@notemesh.app";
  const password = process.env.DEMO_PASSWORD ?? "demopassword";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Demo User", passwordHash },
    create: { name: "Demo User", email, passwordHash },
  });

  const tags = await Promise.all(
    [
      { name: "ideas", color: "#6366F1" },
      { name: "research", color: "#22C55E" },
      { name: "writing", color: "#F59E0B" },
    ].map((tag) =>
      prisma.tag.upsert({
        where: { userId_name: { userId: user.id, name: tag.name } },
        update: { color: tag.color },
        create: { ...tag, userId: user.id },
      }),
    ),
  );

  const note = await prisma.note.create({
    data: {
      userId: user.id,
      title: "Welcome to NoteMesh",
      slug: "welcome-to-notemesh",
      content:
        "# Welcome to NoteMesh\n\nThis is your first note. Use **Markdown** and keep thinking in a flat structure.\n\n- Press Ctrl/Cmd + K for quick search\n- Use tags to organize\n- Autosave keeps your work safe",
      excerpt: "This is your first note. Use Markdown and keep thinking in a flat structure.",
      noteTags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[2].id }],
      },
    },
  });

  await prisma.shareLink.upsert({
    where: { token: "demo-share-link" },
    update: { noteId: note.id, isActive: true },
    create: { noteId: note.id, token: "demo-share-link", isActive: true },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
