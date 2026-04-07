import { redirect } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar name={user.name} role={user.role} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border" />
            <p className="text-sm text-muted-foreground font-medium">
              Memory Lane
            </p>
          </header>
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
