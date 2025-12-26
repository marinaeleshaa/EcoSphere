/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { useTranslations } from "next-intl";
import { EventProps } from "@/types/EventTypes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EventCard from '@/components/layout/common/events/EventCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EventType } from '@/backend/features/event/event.model';

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


export default function UpcomingEvents({ events }: EventProps) {
    const t = useTranslations("Events.displayEvents");
    console.log(events);
    

    const [resetKey, setResetKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<EventType | undefined>(undefined);
    const [priceFilter, setPriceFilter] = useState<"free" | "paid" | undefined>(undefined);
    const [dateFilter, setDateFilter] = useState<"today" | "this_week" | "this_month" | undefined>(undefined);

    const now = new Date();

    const upcomingEvents = events
        .filter(event => getEventEndDateTime(event) > now)
        .filter(event =>
            event.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(event => {
            if (!priceFilter) return true;
            if (priceFilter === "free") return event.ticketPrice === 0;
            return event.ticketPrice > 0;
        })
        .filter(event => {
            if (!typeFilter) return true;
            return event.type === typeFilter;
        })
        .filter(event => {
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
                return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();

            return true;
        })
        .sort(
            (a, b) => getEventStartDateTime(a).getTime() - getEventStartDateTime(b).getTime()
        );

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
                    className="h-11 ltr:rounded-l-full rtl:rounded-r-full"
                />
                <Button className="h-11 ltr:rounded-r-full ltr:rounded-l-none rtl:rounded-l-full rtl:rounded-r-none px-15">
                    {t("search")}
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-3 items-center w-full">
                {/* Event Type */}
                <Select key={`type-${resetKey}`} value={typeFilter} onValueChange={(v) => setTypeFilter(v as EventType)}>
                    <SelectTrigger className="h-10 rounded-full w-full px-4 rtl:flex-row-reverse">
                        <SelectValue placeholder={t("eventType")} />
                    </SelectTrigger>
                    <SelectContent className="rtl:text-right">
                        <SelectItem value="environmental_seminar">{t("environmental_seminar")}</SelectItem>
                        <SelectItem value="community_cleanup">{t("community_cleanup")}</SelectItem>
                        <SelectItem value="sustainable_brands_showcase">{t("sustainable_brands_showcase")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date */}
                <Select key={`date-${resetKey}`} value={dateFilter} onValueChange={(v) => setDateFilter(v as any)}>
                    <SelectTrigger className="h-10 rounded-full w-full px-4 rtl:flex-row-reverse">
                        <SelectValue placeholder={t("date")} />
                    </SelectTrigger>
                    <SelectContent className="rtl:text-right">
                        <SelectItem value="today">{t("today")}</SelectItem>
                        <SelectItem value="this_week">{t("thisWeek")}</SelectItem>
                        <SelectItem value="this_month">{t("thisMonth")}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Price */}
                <Select key={`price-${resetKey}`} value={priceFilter} onValueChange={(v) => setPriceFilter(v as any)}>
                    <SelectTrigger className="h-10 rounded-full w-full px-4 rtl:flex-row-reverse">
                        <SelectValue placeholder={t("price")} />
                    </SelectTrigger>
                    <SelectContent className="rtl:text-right">
                        <SelectItem value="free">{t("free")}</SelectItem>
                        <SelectItem value="paid">{t("paid")}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button
                    className='bg-primary text-primary-foreground hover:bg-primary/80 rounded-full hover:text-primary-foreground'
                    variant="ghost"
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
            {upcomingEvents.length > 0 ? (
                <section className="space-y-4 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                </section>
            ) : (
                <div className="text-center w-full p-8 rounded-xl shadow-md text-muted-foreground border-2 border-primary space-y-4">
                    <p className='mb-3'>{t("noupcomingEvents")}</p>
                    <Button asChild className="capitalize">
                        <Link href="/organizer/manage">{t("addEventBtn")}</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
