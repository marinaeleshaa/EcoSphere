"use client";
import { BadgeCheck, ChevronsUpDown, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function UserBtn({ session }: Readonly<{ session: Session }>) {
  const { isMobile, state } = useSidebar();
  const router = useRouter();
  const t = useTranslations("Layout.UserBtn");

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
    toast.success(t("logoutSuccess"));
  };

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <SidebarMenuButton
            size="lg"
            tooltip={session?.user.name ?? ""}
            className="group gap-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
          >
            <Avatar className="h-9 w-9 rounded-lg transition-all duration-200 group-hover:scale-101 group-hover:shadow-md group-hover:ring-2 group-hover:ring-sidebar-accent">
              <AvatarImage
                src={session?.user.image ?? ""}
                alt={session?.user.name ?? ""}
              />
              <AvatarFallback className="rounded-lg font-semibold">
                {session?.user.name?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            {/* Hide text when collapsed */}
            {state !== "collapsed" && (
              <>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email}
                  </span>
                </span>
                <ChevronsUpDown className="ml-auto size-4" />
              </>
            )}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex rtl:flex-row-reverse items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-xl">
                <AvatarImage
                  src={session?.user.image ?? ""}
                  alt={session?.user.name ?? ""}
                />
                <AvatarFallback className="rounded-xl">
                  {session?.user.name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left rtl:text-right text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          {/*<DropdownMenuSeparator />*/}
          {session?.user?.role === "shop" && (
            <DropdownMenuGroup>
              <Link href="/subscription">
                <DropdownMenuItem className="rtl:flex-row-reverse cursor-pointer">
                  <Sparkles />
                  {t("subscribe")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuItem className="rtl:flex-row-reverse cursor-pointer">
                <BadgeCheck />
                {t("profile")}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="rtl:flex-row-reverse cursor-pointer"
          >
            <LogOut />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
