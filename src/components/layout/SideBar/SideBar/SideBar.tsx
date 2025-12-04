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
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
// import GetFavCount from "@/frontend/Actions/GetFavCount";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
// Menu items.
// User items.


export default function SideBar() {
	// const user = useSelector((state: RootState) => state.user)
	const { data: session, status } = useSession();

	const t = useTranslations('Layout.Sidebar');
	const useritems = [
		{
			title: t('menu.home'),
			url: "/",
			icon: Home,
		},
		{
			title: t('menu.shops'),
			url: "/shop",
			icon: ShoppingBag,
		},
		{
			title: t('menu.events'),
			url: "/events",
			icon: Calendar,
		},
		{
			title: t('menu.recycle'),
			url: "/recycle",
			icon: Recycle,
		},
		{
			title: t('menu.news'),
			url: "/news",
			icon: Newspaper,
		},
		{
			title: t('menu.store'),
			url: "/store",
			icon: Store,
		},
		{
			title: t('menu.game'),
			url: "/game",
			icon: Gamepad2,
		},
		{
			title: t('menu.about'),
			url: "/about",
			icon: Info,
		},
	];
	// Event dashboard items.
	const dashboardItems = [
		{
			title: t('dashboard.overview'),
			url: "/overview",
			icon: RxDashboard,
		},
		{
			title: t('dashboard.addEvent'),
			url: "/add",
			icon: MdOutlineAddToPhotos,
		},
		{
			title: t('dashboard.eventDetails'),
			url: "/viewDetails",
			icon: MdOutlineEventRepeat,
		},
		{
			title: t('dashboard.browseEvents'),
			url: "/browse",
			icon: PiListMagnifyingGlassBold,
		},
	];

	const pathname = usePathname();
	const { favProducts } = useSelector((state: RootState) => state.fav);
	return (
		<Sidebar collapsible="icon" variant="floating" className="bg-background ">
			<SidebarHeader>
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t('groups.application')}</SidebarGroupLabel>
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
					<SidebarGroupLabel>{t('groups.dashboard')}</SidebarGroupLabel>
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
									<span>{t('footer.favorite')}</span>
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
									<span>{t('footer.cart')}</span>
								</Link>
							</SidebarMenuButton>
							<SidebarMenuBadge>24</SidebarMenuBadge>
						</SidebarMenuItem>
						{status === "unauthenticated" && (
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={pathname === "/auth"}>
									<Link href="/auth">
										<LogIn />
										<span>{t('footer.login')}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)}
						<ThemeBtn />
						<LanguageSwitcher />
						<UserBtn session={session!} status={status} />
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarFooter>
		</Sidebar>
	);
}
