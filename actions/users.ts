"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserRole } from "@/types";

export async function createUser(
  _prevState: unknown,
  formData: FormData
): Promise<{ error: string } | void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return { error: "Behörighet saknas" };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  if (!name) return { error: "Ange ett namn" };
  if (!email || !email.includes("@")) return { error: "Ange en giltig e-postadress" };
  if (!password || password.length < 8) return { error: "Lösenordet måste vara minst 8 tecken" };
  if (!["QUESTIONER", "ANSWERER", "ADMIN"].includes(role)) {
    return { error: "Välj en giltig roll" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.createUser({ name, email, passwordHash, role });
  } catch {
    return { error: "E-postadressen används redan av en annan användare" };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  if (!id || id === admin.id) return;

  await db.deleteUser(id);
  revalidatePath("/admin/users");
}
