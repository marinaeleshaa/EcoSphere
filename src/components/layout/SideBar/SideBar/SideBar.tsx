"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/frontend/redux/store";
import { PiListMagnifyingGlassBold } from "react-icons/pi";
import {
	Gamepad2,
	Calendar,
	Home,
	ShoppingBag,
	Recycle,
	Store,
	ShoppingCart,
	Heart,
	LogIn,
	Newspaper,
	Info,
} from "lucide-react";
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
	SidebarTrigger,
	SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { MdOutlineAddToPhotos, MdOutlineEventRepeat } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import ThemeBtn from "../ThemeBtn/ThemeBtn";
import UserBtn from "../UserBtn/UserBtn";
// import GetFavCount from "@/frontend/Actions/GetFavCount";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
// Menu items.
// User items.
const useritems = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Shops",
		url: "/shop",
		icon: ShoppingBag,
	},
	{
		title: "Events",
		url: "/events",
		icon: Calendar,
	},
	{
		title: "Recycle",
		url: "/recycle",
		icon: Recycle,
	},
	{
		title: "News",
		url: "/news",
		icon: Newspaper,
	},
	{
		title: "Store",
		url: "/store",
		icon: Store,
	},
	{
		title: "Game",
		url: "/game",
		icon: Gamepad2,
	},
	{
		title: "About",
		url: "/about",
		icon: Info,
	},
];
// Event dashboard items.
const dashboardItems = [
	{
		title: "OverView",
		url: "/overview",
		icon: RxDashboard,
	},
	{
		title: "Add Event",
		url: "/add",
		icon: MdOutlineAddToPhotos,
	},
	{
		title: "View events",
		url: "/viewDetails",
		icon: MdOutlineEventRepeat,
	},
	{
		title: "Browse Events",
		url: "/browse",
		icon: PiListMagnifyingGlassBold,
	},
];

export default function SideBar() {
	// const user = useSelector((state: RootState) => state.user)
	const { data: session, status } = useSession();

	const pathname = usePathname();
	const { favProducts } = useSelector((state: RootState) => state.fav);
	return (
		<Sidebar collapsible="icon" variant="floating" className="bg-background ">
			<SidebarHeader>
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{useritems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url}>
											<item.icon />
											<span className="capitalize">{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{dashboardItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url}>
											<item.icon />
											<span className="capitalize">{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroupContent className="gap-2">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={pathname === "/fav"}>
								<Link href="/fav">
									<Heart />
									<span>Favorite</span>
								</Link>
							</SidebarMenuButton>
							<SidebarMenuBadge suppressHydrationWarning={true}>
								{favProducts.length}
							</SidebarMenuBadge>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild isActive={pathname === "/cart"}>
								<Link href="/cart">
									<ShoppingCart />
									<span>Cart</span>
								</Link>
							</SidebarMenuButton>
							<SidebarMenuBadge>24</SidebarMenuBadge>
						</SidebarMenuItem>
						{status === "unauthenticated" && (
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={pathname === "/auth"}>
									<Link href="/auth">
										<LogIn />
										<span>Login</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}
						<ThemeBtn />
						<UserBtn session={session!} status={status} />
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarFooter>
		</Sidebar>
	);
}
