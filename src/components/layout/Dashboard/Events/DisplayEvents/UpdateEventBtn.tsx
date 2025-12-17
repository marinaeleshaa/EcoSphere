"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
export default function UpdateEventBtn({
  id,
  detailscard,
}: {
  id: string;
  detailscard: boolean;
}) {
  return (
    <Link href={`/organizer/manage/${id}`}>
      {detailscard ? (
        <Button className="p-3 w-full text-primary-foreground bg-primary rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150">
          <FiEdit className=" size-4 items-baseline " />
          Edit Event
        </Button>
      ) : (
        <Button
          className="p-3 text-primary-foreground bg-primary rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150"
          title="Edit Event"
        >
          <FiEdit className=" size-4 items-baseline " />
        </Button>
      )}
    </Link>
  );
}
