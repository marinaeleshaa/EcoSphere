import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { ThemeProvider } from "./theme-provider";
import { StoreProvider } from "./StorePovider";

export async function Providers({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    return (
        <StoreProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <SidebarProvider defaultOpen={defaultOpen}>
                    {children}
                </SidebarProvider>
            </ThemeProvider>
        </StoreProvider>
    );
}