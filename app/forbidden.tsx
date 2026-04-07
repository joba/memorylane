import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1>Behörighet saknas</h1>
        <p className="text-muted-foreground">
          Du har inte tillgång till den här sidan.
        </p>
        <Link
          href="/"
          className="inline-block text-primary underline underline-offset-4"
        >
          Gå tillbaka till startsidan
        </Link>
      </div>
    </main>
  );
}
