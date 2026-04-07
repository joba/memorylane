"use client";

import { useState, useTransition } from "react";
import { createStory } from "@/actions/stories";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhotoUploader } from "@/components/photo-uploader";

interface StoryFormProps {
  questionId: string;
}

export function StoryForm({ questionId }: StoryFormProps) {
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createStory(questionId, blobUrls, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="body">Din berättelse *</Label>
        <p className="text-sm text-muted-foreground">
          Skriv precis som du vill — ett minne, en känsla, en historia.
        </p>
        <Textarea
          id="body"
          name="body"
          placeholder="Det var en gång..."
          rows={12}
          required
          className="resize-y text-lg leading-relaxed"
        />
      </div>

      <PhotoUploader onUploaded={setBlobUrls} maxPhotos={5} />

      <Button
        type="submit"
        disabled={pending}
        className="h-14 px-8 text-xl w-full sm:w-auto"
      >
        {pending ? "Sparar..." : "Spara berättelsen"}
      </Button>
    </form>
  );
}
