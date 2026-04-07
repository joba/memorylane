"use client";

import { useActionState } from "react";
import { createUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UserForm() {
  const [state, action, pending] = useActionState(createUser, null);

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Namn *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Förnamn Efternamn"
          required
          className="h-12 text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-postadress *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="namn@exempel.se"
          required
          className="h-12 text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Lösenord *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minst 8 tecken"
          required
          minLength={8}
          className="h-12 text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Roll *</Label>
        <select
          id="role"
          name="role"
          required
          defaultValue=""
          className="flex h-12 w-full rounded-lg border border-input bg-background px-3 text-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>
            Välj roll...
          </option>
          <option value="QUESTIONER">Frågare (syster)</option>
          <option value="ANSWERER">Berättare (mamma)</option>
          <option value="ADMIN">Administratör</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 px-8 text-lg w-full sm:w-auto"
      >
        {pending ? "Skapar..." : "Skapa användare"}
      </Button>
    </form>
  );
}
