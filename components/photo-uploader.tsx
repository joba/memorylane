"use client";

import { upload } from "@vercel/blob/client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  onUploaded: (urls: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUploader({
  onUploaded,
  maxPhotos = 5,
}: PhotoUploaderProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    if (files.length + urls.length > maxPhotos) {
      setError(`Du kan ladda upp max ${maxPhotos} bilder`);
      return;
    }
    setError(null);
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        newUrls.push(blob.url);
      } catch {
        setError("Det gick inte att ladda upp bilden. Försök igen.");
        setUploading(false);
        return;
      }
    }

    const next = [...urls, ...newUrls];
    setUrls(next);
    onUploaded(next);
    setUploading(false);
  }

  function removePhoto(index: number) {
    const next = urls.filter((_, i) => i !== index);
    setUrls(next);
    onUploaded(next);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="font-medium">
          Bilder{" "}
          <span className="text-muted-foreground font-normal">
            (valfritt, max {maxPhotos})
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Tillåtna format: JPEG, PNG, WEBP – max 10 MB per bild
        </p>
      </div>

      {urls.length < maxPhotos && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
          <span className="text-muted-foreground text-lg">
            {uploading ? "Laddar upp..." : "Tryck här för att välja bilder"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      )}

      {error && <p className="text-destructive text-base">{error}</p>}

      {urls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((url, i) => (
            <div key={url} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={url}
                  alt={`Bild ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 h-7 w-7 p-0 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label={`Ta bort bild ${i + 1}`}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
