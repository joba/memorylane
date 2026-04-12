import { requireRole } from "@/lib/auth";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { QuestionForm } from "@/components/question-form";

export default async function NewQuestionPage() {
  await requireRole(["QUESTIONER", "ADMIN"]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <BreadcrumbNav
        items={[{ label: "Frågor", href: "/questions" }, { label: "Ny fråga" }]}
      />
      <h1>Ställ en fråga</h1>
      <QuestionForm />
    </main>
  );
}
