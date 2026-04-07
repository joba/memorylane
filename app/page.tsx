import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const user = await getCurrentDbUser();
  if (!user) redirect("/sign-in");

  const unansweredCount =
    user.role === "ANSWERER" ? await db.getUnansweredCount() : 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full space-y-10 text-center">
        <div className="space-y-3">
          <h1>Memory Lane</h1>
          <p className="text-muted-foreground text-xl">
            Välkommen, {user.name}!
          </p>
        </div>

        {user.role === "ANSWERER" ? (
          <div className="space-y-6">
            <p className="text-lg">
              {unansweredCount > 0 ? (
                <>
                  Det finns{" "}
                  <strong>
                    {unansweredCount}{" "}
                    {unansweredCount === 1 ? "fråga" : "frågor"}
                  </strong>{" "}
                  som väntar på ditt svar.
                </>
              ) : (
                "Du har svarat på alla frågor! Fantastiskt."
              )}
            </p>
            <Button
              render={<Link href="/questions" />}
              className="h-14 px-8 text-xl w-full sm:w-auto"
            >
              Se alla frågor
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Ställ en fråga om mammas barndom eller läs hennes berättelser.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                render={<Link href="/questions/new" />}
                className="h-14 px-8 text-xl"
              >
                Ställ en ny fråga
              </Button>
              <Button
                render={<Link href="/questions" />}
                variant="outline"
                className="h-14 px-8 text-xl"
              >
                Se alla frågor
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
