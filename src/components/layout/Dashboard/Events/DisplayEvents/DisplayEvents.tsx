import React from "react";
import { useTranslations } from "next-intl";
import { EventProps } from "@/types/EventTypes";
import EventCard from "@/components/layout/common/events/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DisplayEvents({ events }: EventProps) {
  const t = useTranslations("Dashboard.displayEvents");
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );
  return (
    <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl text-center  text-foreground">
        {t("title")}
      </h1>
      {events.length === 0 ? (
        <div className="text-center w-full p-8 rounded-xl shadow-md text-muted-foreground border-2 border-primary space-y-4">
          <p>No events found</p>
          <Button asChild className="capitalize">
            <Link href="/organizer/manage">
              Add Event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
