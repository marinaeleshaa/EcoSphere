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
import { MdOutlineAddToPhotos, MdOutlineEventRepeat, MdRestaurantMenu, MdAssignment } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import ThemeBtn from "../ThemeBtn/ThemeBtn";
import UserBtn from "../UserBtn/UserBtn";
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';

export default function SideBar() {
	
	const { data: session, status } = useSession();
	const t = useTranslations('Layout.Sidebar');
	const matchPathWithOptionalLocale = (pathname: string,targetSegment: string) => {
		const base = `\\${targetSegment}`;
		const ar = `\\/ar\\${targetSegment}`;
		const fr = `\\/fr\\${targetSegment}`;
		return new RegExp(`^(${base}|${ar}?|${fr}?)$`).test(pathname);
	};
	// User items.
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
			url: "/organizer",
			icon: RxDashboard,
		},
		{
			title: t('dashboard.addEvent'),
			url: "/organizer/manage",
			icon: MdOutlineAddToPhotos,
		},
		{
			title: t('dashboard.eventDetails'),
			url: "/organizer/details",
			icon: MdOutlineEventRepeat,
		},
		{
			title: t('dashboard.browseEvents'),
			url: "/organizer/browse",
			icon: PiListMagnifyingGlassBold,
		},
	];
	// Restaurant dashboard items.
	const restaurantItems = [
		{
			title: t('dashboard.products'),
			url: "/restaurant/products",
			icon: MdRestaurantMenu,
		},
		{
			title: t('dashboard.orders'),
			url: "/restaurant/orders",
			icon: MdAssignment,
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
				{(session?.user.role === 'customer' || session === null) &&
					<SidebarGroup>
						<SidebarGroupLabel>{t('groups.application')}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{useritems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={matchPathWithOptionalLocale(pathname, item.url)}>
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
				}
				{
					session?.user.role == 'organizer' &&
					<SidebarGroup>
						<SidebarGroupLabel>{t('groups.dashboard')}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{dashboardItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={matchPathWithOptionalLocale(pathname, item.url)}>
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
				}
				{
					session?.user.role == 'shop' &&
					<SidebarGroup>
						<SidebarGroupLabel>{t('groups.dashboard')}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{restaurantItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={matchPathWithOptionalLocale(pathname, item.url)}>
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
				}
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroupContent className="gap-2">
					{
						(session?.user.role === 'customer' || session === null) && (
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild isActive={matchPathWithOptionalLocale(pathname, "/fav")}>
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
									<SidebarMenuButton asChild isActive={matchPathWithOptionalLocale(pathname, "/cart")}>
										<Link href="/cart">
											<ShoppingCart />
											<span>{t('footer.cart')}</span>
										</Link>
									</SidebarMenuButton>
									<SidebarMenuBadge>24</SidebarMenuBadge>
								</SidebarMenuItem>
							</SidebarMenu>
						)
					}
				</SidebarGroupContent>
				<SidebarGroupContent className="gap-2">
					<SidebarMenu>
						<ThemeBtn />
						<LanguageSwitcher />
						{status === "unauthenticated" ? (
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={matchPathWithOptionalLocale(pathname, "/auth")}>
									<Link href="/auth">
										<LogIn />
										<span>{t('footer.login')}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>)
							:
							<UserBtn session={session!} />
						}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarFooter>
		</Sidebar>
	);
}
