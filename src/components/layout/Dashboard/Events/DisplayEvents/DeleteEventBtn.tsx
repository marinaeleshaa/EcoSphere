"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { DeleteEvent } from "@/frontend/api/Events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
export default function DeleteEventBtn({
  id,
  detailscard,
}: {
  id: string;
  detailscard: boolean;
}) {
  const t = useTranslations("Events.displayEvents.DeleteEventBtn");
  const router = useRouter();
  async function onDelete(id: string) {
    const res = await DeleteEvent({ eventId: id });
    console.log(res);
    if (res) {
      toast.success(t("success"));
      if (detailscard) {
        router.push("/organizer/events");
      }
      router.refresh();
    }
    else{
      toast.error(t("error"));
    }
  }
  return detailscard ? (
    <Button
      onClick={() => onDelete(id)}
      className="p-3 text-white bg-red-600 rounded-full hover:bg-red-700  transition duration-150"
    >
      <RiDeleteBin6Fill className=" size-4 items-baseline " />
      {t("delete")}
    </Button>
  ) : (
    <Button
      onClick={() => onDelete(id)}
      className="p-3 text-white bg-red-600 rounded-full hover:bg-red-700  transition duration-150"
        title={t("delete")}
    >
      <RiDeleteBin6Fill className=" size-4 items-baseline " />
    </Button>
  );
}
