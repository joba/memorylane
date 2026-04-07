"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function login(
  _prevState: unknown,
  formData: FormData
): Promise<{ error: string } | void> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Felaktig e-postadress eller lösenord" };
    }
    throw error; // re-throw redirect
  }
}

export async function logout() {
  await signOut({ redirectTo: "/sign-in" });
}
