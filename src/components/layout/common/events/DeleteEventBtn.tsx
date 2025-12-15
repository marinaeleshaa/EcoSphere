"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { DeleteEvent } from "@/frontend/api/Events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function DeleteEventBtn({
  id,
  detailscard,
}: {
  id: string;
  detailscard: boolean;
}) {
  const router = useRouter();
  async function onDelete(id: string) {
    const res = await DeleteEvent({ eventId: id });
    console.log(res);
    if (res) {
      toast.success("Event Deleted successfully");
      if (detailscard) {
        router.push("/organizer/events");
      }
      router.refresh();
    }
    else{
      toast.error("Error Deleting event");
    }
  }
  return detailscard ? (
    <Button
      onClick={() => onDelete(id)}
      className="p-3 text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
    >
      <RiDeleteBin6Fill className=" size-4 items-baseline " />
      Delete Event
    </Button>
  ) : (
    <Button
      onClick={() => onDelete(id)}
      className="p-3 text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
      title="Delete Event"
    >
      <RiDeleteBin6Fill className=" size-4 items-baseline " />
    </Button>
  );
}
