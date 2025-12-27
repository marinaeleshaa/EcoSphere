import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { ThemeProvider } from "./theme-provider";
import { StoreProvider } from "./StorePovider";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { TooltipProvider } from "@/components/ui/tooltip";
export async function Providers({
  children,
  locale,
}: Readonly<{ children: React.ReactNode; locale: string }>) {
  const messages = await getMessages({ locale });

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <NextIntlClientProvider messages={messages} locale={locale} key={locale}>
      <SessionProvider>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider delayDuration={200}>
              <SidebarProvider defaultOpen={defaultOpen}>
                {children}
              </SidebarProvider>
            </TooltipProvider>
          </ThemeProvider>
        </StoreProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
