"use client";
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
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
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useTranslations } from 'next-intl';

export default function UserBtn({
	session,
	status,
}: Readonly<{ session: Session; status: string }>) {
	const { isMobile } = useSidebar();
	const t = useTranslations('Layout.UserBtn');

	const handleLogout = async () => {
		await signOut({ redirectTo: "/auth" });
	};

	if (status === "unauthenticated") return null;

	// Determine display name and initials based on role
	const isRestaurant =
		session?.user.role === "shop" || session?.user.role === "restaurant";
	const displayName = isRestaurant
		? session?.user.name
		: `${session?.user.name}`;
	const initials = isRestaurant
		? session?.user.name?.substring(0, 2).toUpperCase()
		: `${session?.user.name?.[0] || ""}`;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={session?.user.image ?? ""}
									alt={displayName!}
								/>
								<AvatarFallback className="rounded-lg">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{displayName}</span>
								<span className="truncate text-xs">{session?.user.email}</span>
							</div>
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
										alt={displayName!}
									/>
									<AvatarFallback className="rounded-xl">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{displayName}</span>
									<span className="truncate text-xs">
										{session?.user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								{t('subscribe')}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href="/profile">
								<DropdownMenuItem>
									<BadgeCheck />
									{t('account')}
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem>
								<CreditCard />
								{t('billing')}
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								{t('notifications')}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							<span>{t('logout')}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
