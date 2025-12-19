import React from "react";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import { useTranslations } from "next-intl";
export default function UpdateEventBtn({
  id,
  detailscard,
}: {
  id: string;
  detailscard: boolean;
}) {
  const t = useTranslations("Events.displayEvents");
  return (
    <Link href={`/organizer/manage/${id}`}>
      {detailscard ? (
        <Button className="p-3 w-full text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition duration-150">
          <FiEdit className=" size-4 items-baseline " />
          {t("editBtn")}
        </Button>
      ) : (
        <Button
          className="p-3 text-white bg-primary rounded-full hover:bg-primary/90 transition duration-150"
            title={t("editBtn")}
        >
          <FiEdit className=" size-4 items-baseline " />
        </Button>
      )}
    </Link>
  );
}
