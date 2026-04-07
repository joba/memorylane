import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { StoryView } from "@/components/story-view";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();

  const question = await db.getQuestionById(id);
  if (!question) notFound();

  const story = await db.getStoryByQuestionId(id);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Frågor", href: "/questions" },
          { label: question.title },
        ]}
      />

      <div className="space-y-3">
        <h1>{question.title}</h1>
        {question.description && (
          <p className="text-muted-foreground">{question.description}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Ställd av {question.author_name}
        </p>
      </div>

      <hr className="border-border" />

      {story ? (
        <StoryView story={story} />
      ) : (
        <div className="space-y-6 py-6">
          <p className="text-muted-foreground text-xl">
            Ingen berättelse ännu.
          </p>
          {user.role === "ANSWERER" && (
            <Button
              render={<Link href={`/questions/${id}/story/new`} />}
              className="h-14 px-8 text-xl"
            >
              Skriv din berättelse
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
