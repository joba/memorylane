import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { UserForm } from "@/components/user-form";

export default function NewUserPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Användare", href: "/admin/users" },
          { label: "Ny användare" },
        ]}
      />
      <h1>Skapa användare</h1>
      <UserForm />
    </main>
  );
}
