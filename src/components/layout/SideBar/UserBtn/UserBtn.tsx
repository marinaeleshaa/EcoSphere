"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Sparkles,
} from "lucide-react";
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

export default function UserBtn({ session }: Readonly<{ session: Session }>) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const t = useTranslations("Layout.UserBtn");

  const handleLogout = () => {
    signOut({ redirect: false });
    router.replace("/");
  };

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg flex justify-center">
              <AvatarImage
                src={session?.user.image ?? ""}
                alt={session?.user.name ?? ""}
              />
              <AvatarFallback className="rounded-lg h-8 w-8 ">
                {session?.user.name?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <span className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.user.name}</span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </span>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-xl">
                <AvatarImage
                  src={session?.user.image ?? ""}
                  alt={session?.user.name ?? ""}
                />
                <AvatarFallback className="rounded-xl">
                  {session?.user.name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          {/*<DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/subscription">
              <DropdownMenuItem>
                <Sparkles />
                {t('subscribe')}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>*/}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuItem>
                <BadgeCheck />
                {t("profile")}
              </DropdownMenuItem>
            </Link>
            {/* <DropdownMenuItem>
              <Bell />
							{t('notifications')}
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
