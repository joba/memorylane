import { auth } from "@/auth";
import type { UserRole, User } from "@/types";

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as User;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
  }
  return user as User;
}

export async function requireRole(required: UserRole[]): Promise<User> {
  const user = await getCurrentUser();
  if (!user || !required.includes(user.role)) {
    const { forbidden } = await import("next/navigation");
    forbidden();
  }
  return user as User;
}

export async function requireAdmin(): Promise<User> {
  return requireRole(["ADMIN"]);
}
