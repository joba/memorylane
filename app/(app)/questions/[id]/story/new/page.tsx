import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { StoryForm } from "@/components/story-form";

export default async function NewStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole("ANSWERER");

  const question = await db.getQuestionById(id);
  if (!question) notFound();

  // If a story already exists, redirect to the question page
  const existing = await db.getStoryByQuestionId(id);
  if (existing) {
    const { redirect } = await import("next/navigation");
    redirect(`/questions/${id}`);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Frågor", href: "/questions" },
          { label: question.title, href: `/questions/${id}` },
          { label: "Skriv berättelse" },
        ]}
      />

      <div className="space-y-2">
        <h1>Skriv din berättelse</h1>
        <p className="text-muted-foreground text-xl">{question.title}</p>
      </div>

      <StoryForm questionId={id} />
    </main>
  );
}
