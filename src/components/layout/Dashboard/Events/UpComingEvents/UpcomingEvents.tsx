/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { EventProps } from "@/types/EventTypes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EventCard from "@/components/layout/common/events/EventCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EventType } from "@/backend/features/event/event.model";
import BasicAnimatedWrapper from "@/components/layout/common/BasicAnimatedWrapper";
import EventCardSkeleton from "@/components/layout/common/events/EventCardSkeleton";
import { TbCalendarEvent } from "react-icons/tb";

export const getEventStartDateTime = (event: any) => {
  return new Date(
    `${event.eventDate.split("T")[0]}T${event.startTime ?? "00:00"}`
  );
};

export const getEventEndDateTime = (event: any) => {
  return new Date(
    `${event.eventDate.split("T")[0]}T${event.endTime ?? "23:59"}`
  );
};

export const isEventLiveNow = (event: any, now: Date) => {
  const start = getEventStartDateTime(event);
  const end = getEventEndDateTime(event);

  return event.isAccepted && start <= now && end >= now;
};


export default function UpcomingEvents({ events }: Readonly<EventProps>) {
  const t = useTranslations("Events.displayEvents");
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<EventType | undefined>(
    undefined
  );
  const [priceFilter, setPriceFilter] = useState<"free" | "paid" | undefined>(
    undefined
  );
  const [dateFilter, setDateFilter] = useState<
    "today" | "this_week" | "this_month" | undefined
  >(undefined);

  const now = new Date();

  const upcomingEvents = events
    .filter((event) => getEventEndDateTime(event) > now)
    .filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((event) => {
      if (!priceFilter) return true;
      if (priceFilter === "free") return event.ticketPrice === 0;
      return event.ticketPrice > 0;
    })
    .filter((event) => {
      if (!typeFilter) return true;
      return event.type === typeFilter;
    })
    .filter((event) => {
      if (!dateFilter) return true;

      const start = getEventStartDateTime(event);

      if (dateFilter === "today")
        return start.toDateString() === now.toDateString();

      if (dateFilter === "this_week") {
        const weekEnd = new Date();
        weekEnd.setDate(now.getDate() + 7);
        return start >= now && start <= weekEnd;
      }

      if (dateFilter === "this_month")
        return (
          start.getMonth() === now.getMonth() &&
          start.getFullYear() === now.getFullYear()
        );

      return true;
    })
    .sort((a, b) => {
      const aLive = isEventLiveNow(a, now);
      const bLive = isEventLiveNow(b, now);

      // LIVE events first
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      // Otherwise sort by start time
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
    <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl text-center text-foreground">
        {t("UpComingEvents")}
      </h1>

      {/* Search */}
      <div className="flex w-full">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          className="h-11 border-primary ltr:rounded-l-full rtl:rounded-r-full"
        />
        <Button className="h-11 ltr:rounded-r-full ltr:rounded-l-none rtl:rounded-l-full rtl:rounded-r-none px-15">
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
          <SelectContent className="rtl:text-right">
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
          <SelectTrigger className="h-10 rounded-full border-primary w-full px-4 rtl:flex-row-reverse cursor-pointer">
            <SelectValue placeholder={t("price")} />
          </SelectTrigger>
          <SelectContent className="rtl:text-right">
            <SelectItem value="free">{t("free")}</SelectItem>
            <SelectItem value="paid">{t("paid")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-full hover:text-primary-foreground"
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

      {/* Upcoming Events */}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5 gap-6 items-stretch">
          {Array.from({ length: 6 }).map((_, index) => (
            <BasicAnimatedWrapper key={index} index={index}>
              <EventCardSkeleton />
            </BasicAnimatedWrapper>
          ))}
        </div>
      ) : (upcomingEvents.length == 0 ? (
        <div className="flex items-center justify-center md:p-20 p-5 bg-primary/10 rounded-xl mt-10 my-10">
          <div className="text-center max-w-md px-6">
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 ">
              <TbCalendarEvent className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t("UpComingEvents")}
            </h2>

            <p className="text-secondary-foreground mb-4">{t("noupcomingEvents")}</p>
              <Link href="/organizer/manage" className="px-20! myBtnPrimary w-full  mx-auto">
              {t("addEventBtn")}
            </Link>
          </div>
        </div>
      ) : (

        <section className="space-y-4 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {upcomingEvents.map((event, index) => (
              <BasicAnimatedWrapper key={event._id} index={index}>
                <EventCard event={event} />
              </BasicAnimatedWrapper>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
