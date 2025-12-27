"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/frontend/redux/store";
import { LuCalendarClock } from "react-icons/lu";
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
  Info,
  Salad,
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MdOutlineAddToPhotos,
  MdOutlineEventRepeat,
  MdRestaurantMenu,
  MdAssignment,
  MdEventAvailable,
} from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import ThemeBtn from "../ThemeBtn/ThemeBtn";
import UserBtn from "../UserBtn/UserBtn";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useAppSelector } from "@/frontend/redux/hooks";
import { selectCartItemCount } from "@/frontend/redux/selector/cartSelector";

export default function SideBar() {
  const cartItemsCount = useAppSelector(selectCartItemCount);
  const { data: session, status } = useSession();
  const t = useTranslations("Layout.Sidebar");
  const matchPathWithOptionalLocale = (
    pathname: string,
    targetSegment: string,
  ) => {
    const base = `\\${targetSegment}`;
    const en = `\\/en\\${targetSegment}`;
    const ar = `\\/ar\\${targetSegment}`;
    const fr = `\\/fr\\${targetSegment}`;
    return new RegExp(`^(${base}|${en}?|${ar}?|${fr}?)$`).test(pathname);
  };

  const { setOpenMobile } = useSidebar();
  // User items.
  const useritems = [
    {
      title: t("menu.home"),
      url: "/",
      icon: Home,
    },
    {
      title: t("menu.shops"),
      url: "/shop",
      icon: ShoppingBag,
    },
    {
      title: t("menu.events"),
      url: "/events",
      icon: Calendar,
    },
    {
      title: t("menu.store"),
      url: "/store",
      icon: Store,
    },
    {
      title: t("menu.game"),
      url: "/game",
      icon: Gamepad2,
    },
    {
      title: t("menu.about"),
      url: "/about",
      icon: Info,
    },
  ];
  // Event dashboard items.
  const OrganizerItems = [
    {
      title: t("dashboard.overview"),
      url: "/organizer",
      icon: RxDashboard,
    },
    {
      title: t("dashboard.mangeevent"),
      url: "/organizer/manage",
      icon: MdOutlineAddToPhotos,
    },
    {
      title: t("dashboard.upcomingevents"),
      url: "/organizer/upcomingEvents",
      icon: LuCalendarClock,
    },
    {
      title: t("dashboard.history"),
      url: "/organizer/history",
      icon: MdOutlineEventRepeat,
    },
  ];
  // Restaurant dashboard items.
  const restaurantItems = [
    {
      title: t("dashboard.products"),
      url: "/restaurant/products",
      icon: MdRestaurantMenu,
    },
    {
      title: t("dashboard.orders"),
      url: "/restaurant/orders",
      icon: MdAssignment,
    },
  ];
  // admin dashboard items.
  const adminItems = [
    {
      title: t("dashboard.shops"),
      url: "/admin/shop",
      icon: FaShop,
    },
    {
      title: t("dashboard.events"),
      url: "/admin/event",
      icon: MdEventAvailable,
    },
    {
      title: t("dashboard.recycleAgent"),
      url: "/admin/recycleAgent",
      icon: Recycle,
    },
  ];
  // recycle dashboard items.
  const recycleItems = [
    {
      title: t("menu.recycle"),
      url: "/recycleDash",
      icon: Recycle,
    },
  ];

  const pathname = usePathname();
  const locale = useLocale();
  const { favProducts } = useSelector((state: RootState) => state.fav);
  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      collapsible="icon"
      variant="floating"
      className="bg-background min-h-screen"
    >
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {(session?.user.role === "customer" || session === null) && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("groups.application")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {useritems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={matchPathWithOptionalLocale(pathname, item.url)}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={t("menu.recipes")}
                    isActive={matchPathWithOptionalLocale(pathname, "/recipes")}
                  >
                    <Link href="/recipes">
                      <Salad />
                      <span className="capitalize">{t("menu.recipes")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={t("menu.recycle")}
                    isActive={matchPathWithOptionalLocale(pathname, "/recycle")}
                  >
                    <Link href="/recycle">
                      <Recycle />
                      <span className="capitalize">{t("menu.recycle")}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {session?.user.role == "shop" && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("groups.dashboard")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {restaurantItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={matchPathWithOptionalLocale(pathname, item.url)}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {(session?.user.role == "organizer" ||
          session?.user.role == "shop") && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("groups.dashboard")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {OrganizerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={matchPathWithOptionalLocale(pathname, item.url)}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {session?.user.role == "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("groups.admin")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={matchPathWithOptionalLocale(pathname, item.url)}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* **! change the role to be recycleAgent */}
        {session?.user.role == "recycleAgent" && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("groups.dashboard")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recycleItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={matchPathWithOptionalLocale(pathname, item.url)}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon />
                        <span className="capitalize">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent className="gap-2">
          {(session?.user.role === "customer" || session === null) && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="favorite"
                  isActive={matchPathWithOptionalLocale(pathname, "/fav")}
                >
                  <Link href="/fav" onClick={() => setOpenMobile(false)}>
                    <Heart />
                    <span>{t("footer.favorite")}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge suppressHydrationWarning={true}>
                  {favProducts.length}
                </SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="cart"
                  isActive={matchPathWithOptionalLocale(pathname, "/cart")}
                >
                  <Link href="/cart" onClick={() => setOpenMobile(false)}>
                    <ShoppingCart />
                    <span>{t("footer.cart")}</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>{cartItemsCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarGroupContent>
        <SidebarGroupContent className="gap-2">
          <SidebarMenu>
            <ThemeBtn />
            <LanguageSwitcher />
            {status === "unauthenticated" ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="login"
                  isActive={matchPathWithOptionalLocale(pathname, "/auth")}
                >
                  <Link href="/auth" onClick={() => setOpenMobile(false)}>
                    <LogIn />
                    <span>{t("footer.login")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <UserBtn session={session!} />
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
