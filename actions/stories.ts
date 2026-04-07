"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createStory(
  questionId: string,
  blobUrls: string[],
  formData: FormData
): Promise<{ error: string } | void> {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "ANSWERER") {
    return { error: "Behörighet saknas" };
  }

  const body = (formData.get("body") as string)?.trim();
  if (!body) {
    return { error: "Berättelsen kan inte vara tom" };
  }

  const story = await db.createStory({
    questionId,
    authorId: user.id,
    body,
  });

  for (let i = 0; i < blobUrls.length; i++) {
    await db.createPhoto({
      storyId: story.id,
      blobUrl: blobUrls[i],
      sortOrder: i,
    });
  }

  revalidatePath(`/questions/${questionId}`);
  revalidatePath("/questions");
  redirect(`/questions/${questionId}`);
}
