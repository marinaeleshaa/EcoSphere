import { cookies } from "next/headers";
import { SidebarProvider } from "../../components/ui/sidebar";
import { ThemeProvider } from "./theme-provider";
import { StoreProvider } from "./StorePovider";
import { SessionProvider } from "next-auth/react";

export async function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
	return (
		<StoreProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<SessionProvider>
					<SidebarProvider defaultOpen={defaultOpen}>
						{children}
					</SidebarProvider>
				</SessionProvider>
			</ThemeProvider>
		</StoreProvider>
	);
}
