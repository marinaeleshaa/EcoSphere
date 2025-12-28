/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { EventProps } from "@/types/EventTypes";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventCard from "../common/events/EventCard";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventType } from "@/backend/features/event/event.model";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";
import { TbCalendarEvent } from "react-icons/tb";
import EventCardSkeleton from "../common/events/EventCardSkeleton";

const getEventStartDateTime = (event: any) =>
  new Date(`${event.eventDate.split("T")[0]}T${event.startTime ?? "00:00"}`);

const getEventEndDateTime = (event: any) =>
  new Date(`${event.eventDate.split("T")[0]}T${event.endTime ?? "23:59"}`);

const isEventLiveNow = (event: any, now: Date) => {
  if (!event.isAccepted) return false;
  return (
    getEventStartDateTime(event) <= now &&
    getEventEndDateTime(event) >= now
  );
};

export default function MainDisplayEvents({ events }: Readonly<EventProps>) {
  const t = useTranslations("Events.MainDisplayEvents");
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"free" | "paid" | undefined>(
    undefined
  );
  const [typeFilter, setTypeFilter] = useState<EventType | undefined>(
    undefined
  );
  const [dateFilter, setDateFilter] = useState<
    "today" | "this_week" | "this_month" | undefined
  >(undefined);

  const now = new Date();


  const filteredEvents = events
    // ✅ Accepted by admin only
    .filter(event => event.isAccepted)

    // ✅ Upcoming or live (not ended)
    .filter(event => getEventEndDateTime(event) > now)

    // 🔍 Search
    .filter(event =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 💰 Price
    .filter(event => {
      if (!priceFilter) return true;
      if (priceFilter === "free") return event.ticketPrice === 0;
      return event.ticketPrice > 0;
    })

    // 🏷️ Type
    .filter(event => {
      if (!typeFilter) return true;
      return event.type === typeFilter;
    })

    // 📅 Date
    .filter(event => {
      if (!dateFilter) return true;

      const start = getEventStartDateTime(event);

      if (dateFilter === "today") {
        return start.toDateString() === now.toDateString();
      }

      if (dateFilter === "this_week") {
        const weekEnd = new Date();
        weekEnd.setDate(now.getDate() + 7);
        return start >= now && start <= weekEnd;
      }

      if (dateFilter === "this_month") {
        return (
          start.getMonth() === now.getMonth() &&
          start.getFullYear() === now.getFullYear()
        );
      }

      return true;
    })

    // 🔥 Sorting (LIVE → Upcoming → Date)
    .sort((a, b) => {
      const aLive = isEventLiveNow(a, now);
      const bLive = isEventLiveNow(b, now);

      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      return (
        getEventStartDateTime(a).getTime() -
        getEventStartDateTime(b).getTime()
      );
    });




  React.useEffect(() => {
    if (events) setIsLoading(false);
  }, [events]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 py-5">
      <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
        {t("upcomingEvents")}
      </h2>
      {/* Search */}
      <div className="flex w-full">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          className="h-11 border-primary ltr:rounded-l-full rtl:rounded-r-full"
        />
        <Button className="h-11 ltr:rounded-r-full ltr:rounded-l-none rtl:rounded-l-full rtl:rounded-r-none px-7 md:px-15">
          {t("search")}
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center w-full">
        {/* Event Type */}
        <Select
          key={`type-${resetKey}`}
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as EventType)}
        >
          <SelectTrigger className="h-10 rounded-full border-primary w-full px-4 rtl:flex-row-reverse cursor-pointer">
            <SelectValue placeholder={t("eventType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="environmental_seminar">
              {t("environmental_seminar")}
            </SelectItem>
            <SelectItem value="community_cleanup">
              {t("community_cleanup")}
            </SelectItem>
            <SelectItem value="sustainable_brands_showcase">
              {t("sustainable_brands_showcase")}
            </SelectItem>
            <SelectItem value="other">{t("other")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Date */}
        <Select
          key={`date-${resetKey}`}
          value={dateFilter}
          onValueChange={(v) => setDateFilter(v as any)}
        >
          <SelectTrigger className="h-10 rounded-full border-primary w-full px-4 rtl:flex-row-reverse cursor-pointer">
            <SelectValue placeholder={t("date")} />
          </SelectTrigger>
          <SelectContent className="rtl:text-right">
            <SelectItem value="today">{t("today")}</SelectItem>
            <SelectItem value="this_week">{t("thisWeek")}</SelectItem>
            <SelectItem value="this_month">{t("thisMonth")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Price */}
        <Select
          key={`price-${resetKey}`}
          value={priceFilter}
          onValueChange={(v) => setPriceFilter(v as any)}
        >
          <SelectTrigger className="h-10 rounded-full border-primary w-full px-4  rtl:flex-row-reverse cursor-pointer">
            <SelectValue placeholder={t("price")} />
          </SelectTrigger>
          <SelectContent className=" text-right">
            <SelectItem value="free">{t("free")}</SelectItem>
            <SelectItem value="paid">{t("paid")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          className="bg-primary text-primary-foreground rounded-full hover:text-primary-foreground"
          onClick={() => {
            setTypeFilter(undefined);
            setPriceFilter(undefined);
            setDateFilter(undefined);
            setSearchQuery("");
            setResetKey((prev) => prev + 1);
          }}
        >
          {t("clearFilters")}
        </Button>
      </div>

      {/* Display Events */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5 gap-6 items-stretch">
          {Array.from({ length: 6 }).map((_, index) => (
            <BasicAnimatedWrapper key={index} index={index}>
              <EventCardSkeleton />
            </BasicAnimatedWrapper>
          ))}
        </div>
      ) : (filteredEvents.length === 0 ? (
        <div className="flex items-center justify-center md:p-20 p-5 bg-primary/10 rounded-xl mt-10 my-10">
          <div className="text-center max-w-md px-6">
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 ">
              <TbCalendarEvent className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t("title")}
            </h2>

            <p className="text-secondary-foreground ">{t("emptyTitle")}</p>
            <p className="text-secondary-foreground mb-6">{t("emptySubtitle")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5 gap-6">
          {filteredEvents.map((event, index) => (
            <BasicAnimatedWrapper key={event._id} index={index}>
              <EventCard event={event} />
            </BasicAnimatedWrapper>
          ))}
        </div>
      ))
      }
    </div>
  );
}