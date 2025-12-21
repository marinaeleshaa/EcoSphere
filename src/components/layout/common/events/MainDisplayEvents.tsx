"use client";
import { EventProps } from "@/types/EventTypes";
import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import EventCard from "./EventCard";
import { useTranslations } from "next-intl";

export default function MainDisplayEvents({ events }: Readonly<EventProps>) {
  const t = useTranslations("Events.MainDisplayEvents");
console.log(events);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const now = new Date();

  const filteredEvents = events
    .filter((event) => event.isAccepted === true)
    .filter((event) => {
      const query = searchQuery.toLowerCase();
      return event.name.toLowerCase().includes(query);
    })
    .filter((event) => new Date(event.eventDate) >= now)
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );

  return (
    <>
      <div className="w-full flex justify-end">
        <ButtonGroup className="rtl:flex-row-reverse">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="outline" aria-label={t("search")}>
            <SearchIcon />
          </Button>
        </ButtonGroup>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      {filteredEvents.length === 0 && (
        <div className="text-center w-full p-8 rounded-xl shadow-md text-muted-foreground border-2 border-primary">
          <p>{t("emptyTitle")}</p>
          <p>{t("emptySubtitle")}</p>
        </div>
      )}
    </>
  );
}
