"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useLocale } from "next-intl";
import React from "react";

export default function SidebarTriggerBtn() {
  const { open, isMobile } = useSidebar();
  const locale = useLocale();
  return isMobile ? (
    <SidebarTrigger
      className={`sticky ${open ? "hidden" : "sticky"}  top-4 ${
        locale === "ar" ? "right-4" : "left-4"
      } z-50 size-8`}
    />
  ) : (
    <SidebarTrigger className="hidden" />
  );
}
