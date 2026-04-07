"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createQuestion(
  _prevState: unknown,
  formData: FormData
): Promise<{ error: string } | void> {
  const user = await getCurrentDbUser();
  if (!user || user.role !== "QUESTIONER") {
    return { error: "Behörighet saknas" };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!title) {
    return { error: "Ange en rubrik för frågan" };
  }
  if (title.length > 200) {
    return { error: "Rubriken är för lång (max 200 tecken)" };
  }

  const question = await db.createQuestion({
    authorId: user.id,
    title,
    description,
  });

  revalidatePath("/questions");
  redirect(`/questions/${question.id}`);
}
