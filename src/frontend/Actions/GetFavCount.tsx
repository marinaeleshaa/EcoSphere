"use client";
import { RootState } from "@/frontend/redux/store";
import { useSelector } from "react-redux";
import {SidebarMenuBadge} from "@/components/ui/sidebar"
const GetFavCount = () => {
  const { favProducts } = useSelector((state: RootState) => state.fav);
  return <SidebarMenuBadge suppressHydrationWarning={true}>{favProducts.length}</SidebarMenuBadge>;
};

export default GetFavCount;
