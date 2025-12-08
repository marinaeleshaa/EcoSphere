"use client";

import CustomerProfile from "@/components/layout/profile/CustomerProfile";
import OrganizerProfile from "@/components/layout/profile/OrganizerProfile";
import RestaurantProfile from "@/components/layout/profile/RestaurantProfile";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const t = useTranslations("Profile.page");

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">{t("pleaseLogin")}</p>
      </div>
    );
  }

  if (status === "loading") {
    return <div>loading</div>;
  }
  return (
    status === "authenticated" && (
      <div className=" bg-background py-8">
        <div className="min-h-screen flex justify-center items-center w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-[80%]">
            {session?.user.role === "customer" && (
              <CustomerProfile
                id={session?.user.id}
                role={session?.user.role}
              />
            )}
            {session?.user.role === "organizer" && (
              <OrganizerProfile
                id={session?.user.id}
                role={session?.user.role}
              />
            )}
            {(session?.user.role === "restaurant" ||
              session?.user.role === "shop") && (
              <RestaurantProfile
                id={session?.user.id}
                role={session?.user.role}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
}
