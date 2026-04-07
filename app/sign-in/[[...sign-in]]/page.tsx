import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1>Memory Lane</h1>
          <p className="text-muted-foreground">
            Logga in för att se och dela minnen
          </p>
        </div>
        <SignIn fallbackRedirectUrl="/questions" />
      </div>
    </main>
  );
}
