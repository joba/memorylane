import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PlusCircle } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const unansweredCount =
    user.role === "ANSWERER" ? await db.getUnansweredCount() : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1>Välkommen, {user.name}</h1>
        <p className="text-muted-foreground">
          {user.role === "ANSWERER"
            ? "Här kan du skriva dina minnen och berättelser."
            : "Här kan du ställa frågor om mammas barndom."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <BookOpen className="size-8 text-primary" />
            <div className="space-y-1">
              <p className="font-semibold text-lg">Alla frågor</p>
              <p className="text-muted-foreground text-base">
                {user.role === "ANSWERER" && unansweredCount > 0
                  ? `${unansweredCount} ${unansweredCount === 1 ? "fråga" : "frågor"} väntar på svar`
                  : "Bläddra bland frågor och berättelser"}
              </p>
            </div>
            <Button
              render={<Link href="/questions" />}
              className="h-12 text-base mt-auto"
            >
              Se frågor
            </Button>
          </CardContent>
        </Card>

        {user.role === "QUESTIONER" && (
          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <PlusCircle className="size-8 text-primary" />
              <div className="space-y-1">
                <p className="font-semibold text-lg">Ny fråga</p>
                <p className="text-muted-foreground text-base">
                  Undrar du något om mammas barndom?
                </p>
              </div>
              <Button
                render={<Link href="/questions/new" />}
                variant="outline"
                className="h-12 text-base mt-auto"
              >
                Ställ en fråga
              </Button>
            </CardContent>
          </Card>
        )}

        {user.role === "ANSWERER" && unansweredCount === 0 && (
          <Card>
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-8 text-2xl">🎉</div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">Allt besvarat!</p>
                <p className="text-muted-foreground text-base">
                  Du har svarat på alla frågor. Fantastiskt!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
