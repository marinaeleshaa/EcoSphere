"use client";
import { useLocale} from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [, startTransition] = useTransition();

    const onSelectChange = (nextLocale: "en" | "ar" | "fr") => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
            router.refresh();
        });
    };

    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton >
                        <Globe className="size-4" />
                        <span className='uppercase'>{locale}</span>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side={'right'}>
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
    );
}
