import Image from "next/image";
import type { StoryWithPhotos } from "@/types";

interface StoryViewProps {
  story: StoryWithPhotos;
}

export function StoryView({ story }: StoryViewProps) {
  const paragraphs = story.body.split(/\n+/).filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          Skriven av {story.author_name}
        </p>
      </div>

      <div className="space-y-4 text-lg leading-relaxed">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {story.photos.length > 0 && (
        <div className="space-y-4">
          <h3>Bilder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {story.photos.map((photo) => (
              <div key={photo.id} className="space-y-2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={photo.blob_url}
                    alt={photo.caption ?? "Bild"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                {photo.caption && (
                  <p className="text-sm text-muted-foreground text-center">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
