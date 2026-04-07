"use client";

import { useActionState } from "react";
import { createQuestion } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function QuestionForm() {
  const [state, action, pending] = useActionState(createQuestion, null);

  return (
    <form action={action} className="space-y-6">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Fråga *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Vad vill du veta om mammas barndom?"
          required
          maxLength={200}
          className="text-lg h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Mer detaljer{" "}
          <span className="text-muted-foreground font-normal">(valfritt)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Berätta gärna mer om varför du undrar..."
          rows={4}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-14 px-8 text-xl w-full sm:w-auto"
      >
        {pending ? "Skickar..." : "Skicka frågan"}
      </Button>
    </form>
  );
}
