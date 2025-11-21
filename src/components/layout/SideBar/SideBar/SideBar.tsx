import React from 'react'
import { Gamepad2, Calendar, Home, ShoppingBag, Recycle, Store, ShoppingCart, Heart, LogIn, Newspaper, Info } from "lucide-react"
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
    SidebarMenuBadge
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import ThemeBtn from '../ThemeBtn/ThemeBtn'
import UserBtn from '../UserBtn/UserBtn'
// Menu items.
const items = [
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
]

export default function SideBar() {
    return (
        <Sidebar collapsible="icon" variant='floating' className='bg-background'>
            <SidebarHeader >
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroupContent className='gap-2'>
                    <SidebarMenu>
                        <SidebarMenuItem >
                            <SidebarMenuButton asChild >
                                <Link href="/fav">
                                    <Heart />
                                    <span>Favourite</span>
                                    <SidebarMenuBadge>24</SidebarMenuBadge>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem >
                            <SidebarMenuButton asChild >
                                <Link href="/cart">
                                    <ShoppingCart />
                                    <span>cart</span>
                                    <SidebarMenuBadge>24</SidebarMenuBadge>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem >
                            <SidebarMenuButton asChild >
                                <Link href="/auth">
                                    <LogIn />
                                    <span>Login</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <ThemeBtn />
                        <UserBtn />
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarFooter>
        </Sidebar>
    )
}
