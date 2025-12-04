"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export default function LanguageSwitcher() {
    const t = useTranslations("Layout.Sidebar.groups");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (nextLocale: "en" | "ar" | "fr") => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
            router.refresh();
        });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Globe className="size-4" />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{locale.toUpperCase()}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectChange("en")}>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSelectChange("ar")}>
                            العربية
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSelectChange("fr")}>
                            Français
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
