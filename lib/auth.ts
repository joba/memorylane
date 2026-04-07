import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { User, UserRole } from "@/types";

export async function getCurrentDbUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await db.getUserByClerkId(clerkUser.id);
  if (existing) return existing;

  // First-time login: create local user record from Clerk data
  const role = (clerkUser.publicMetadata?.role as UserRole) ?? "QUESTIONER";
  return db.createUser({
    clerkId: clerkUser.id,
    name:
      clerkUser.fullName ??
      clerkUser.username ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      "Okänd",
    role,
  });
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentDbUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/sign-in");
  }
  return user as User;
}

export async function requireRole(required: UserRole): Promise<User> {
  const user = await getCurrentDbUser();
  if (!user || user.role !== required) {
    const { forbidden } = await import("next/navigation");
    forbidden();
  }
  return user as User;
}
