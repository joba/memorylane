import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roleLabels: Record<string, string> = {
  QUESTIONER: "Frågare",
  ANSWERER: "Berättare",
  ADMIN: "Administratör",
};

const roleVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  QUESTIONER: "secondary",
  ANSWERER: "default",
  ADMIN: "outline",
};

export default async function AdminUsersPage() {
  const [users, currentUser] = await Promise.all([
    db.getAllUsers(),
    getCurrentUser(),
  ]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <BreadcrumbNav
        items={[{ label: "Administration" }, { label: "Användare" }]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1>Användare</h1>
        <Button
          render={<Link href="/admin/users/new" />}
          className="h-10 px-5 text-base shrink-0"
        >
          + Ny användare
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>E-post</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant={roleVariants[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.id !== currentUser?.id && (
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        type="submit"
                        className="text-sm text-destructive hover:underline"
                        onClick={(e) => {
                          if (
                            !confirm(
                              `Ta bort ${user.name}? Detta går inte att ångra.`
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Ta bort
                      </button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
