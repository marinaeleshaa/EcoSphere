import React from "react";
import { useTranslations } from "next-intl";
import { EventProps } from "@/types/EventTypes";
import EventCard from "@/components/layout/common/events/EventCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DisplayEvents({ events }: EventProps) {
  const t = useTranslations("Events.displayEvents");
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.eventDate) >= today
  );

  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.eventDate) < today
  );
  return (
    <div className="min-h-screen py-8 w-[80%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl text-center  text-foreground">
        {t("title")}
      </h1>
      
      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center w-full p-8 rounded-xl shadow-md text-muted-foreground border-2 border-primary space-y-4">
          <p>{t("noEvents")}</p>
          <Button asChild className="capitalize">
            <Link href="/organizer/manage">{t("addEventBtn")}</Link>
          </Button>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="space-y-4">
          <h2 className="capitalize font-bold text-2xl mb-5  text-foreground">{t("UpComingEvents")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Past Events (END SECTION) */}
      {pastEvents.length > 0 && (
        <section className="space-y-4  pt-8">
          <h2 className="capitalize font-bold text-2xl mb-5  text-foreground ">
            {t("PastEvents")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
