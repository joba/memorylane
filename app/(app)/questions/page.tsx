import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";

export default async function QuestionsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const questions = await db.getQuestions();

  const unanswered = questions.filter((q) => !q.has_story);
  const answered = questions.filter((q) => q.has_story);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between gap-4">
        <h1>Frågor</h1>
        {user.role === "QUESTIONER" && (
          <Button
            render={<Link href="/questions/new" />}
            className="h-12 px-6 text-lg shrink-0"
          >
            + Ny fråga
          </Button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground text-xl">Inga frågor ännu.</p>
          {user.role === "QUESTIONER" && (
            <Button
              render={<Link href="/questions/new" />}
              className="h-12 px-6 text-lg"
            >
              Ställ den första frågan
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {unanswered.length > 0 && (
            <section className="space-y-4">
              <h2>Väntar på svar</h2>
              <div className="space-y-3">
                {unanswered.map((q) => (
                  <QuestionCard key={q.id} question={q} role={user.role} />
                ))}
              </div>
            </section>
          )}

          {answered.length > 0 && (
            <section className="space-y-4">
              <h2>Besvarade frågor</h2>
              <div className="space-y-3">
                {answered.map((q) => (
                  <QuestionCard key={q.id} question={q} role={user.role} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
