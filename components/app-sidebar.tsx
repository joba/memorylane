"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { BookOpen, Home, LogOut, PlusCircle, ShieldCheck } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types";

interface AppSidebarProps {
  name: string;
  role: UserRole;
}

export function AppSidebar({ name, role }: AppSidebarProps) {
  const pathname = usePathname();

  const mainNav = [
    { label: "Hem", href: "/", icon: Home },
    { label: "Alla frågor", href: "/questions", icon: BookOpen },
    ...(role === "QUESTIONER" || role === "ADMIN"
      ? [{ label: "Ställ en fråga", href: "/questions/new", icon: PlusCircle }]
      : []),
  ];

  const adminNav =
    role === "ADMIN"
      ? [{ label: "Användare", href: "/admin/users", icon: ShieldCheck }]
      : [];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">
            ML
          </div>
          <div className="leading-none">
            <p className="font-semibold text-base">Memory Lane</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Familjeminnen
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      className="text-base h-10 gap-3"
                    >
                      <item.icon className="size-5 shrink-0" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminNav.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNav.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={pathname.startsWith(item.href)}
                        className="text-base h-10 gap-3"
                      >
                        <item.icon className="size-5 shrink-0" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-semibold shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-none truncate">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {role === "ANSWERER"
                ? "Berättare"
                : role === "ADMIN"
                  ? "Administratör"
                  : "Frågare"}
            </p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Logga ut</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
