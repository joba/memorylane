import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuestionWithMeta, UserRole } from "@/types";

interface QuestionCardProps {
  question: QuestionWithMeta;
  role: UserRole;
}

export function QuestionCard({ question, role }: QuestionCardProps) {
  return (
    <Card>
      <CardContent className="p-5 flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/questions/${question.id}`}
              className="font-semibold text-xl hover:underline underline-offset-2 leading-snug"
            >
              {question.title}
            </Link>
            <Badge
              variant={question.has_story ? "default" : "secondary"}
              className="shrink-0"
            >
              {question.has_story ? "Besvarad" : "Väntar"}
            </Badge>
          </div>
          {question.description && (
            <p className="text-muted-foreground line-clamp-2">
              {question.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Ställd av {question.author_name}
          </p>
        </div>

        {role === "ANSWERER" && !question.has_story && (
          <Button
            render={<Link href={`/questions/${question.id}/story/new`} />}
            className="h-11 px-5 text-base shrink-0"
          >
            Svara
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
