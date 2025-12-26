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

const parseEventDate = (dateStr: string) => {
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-').map(Number);
        if (parts[0] > 31) {
            // YYYY-MM-DD
            return new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
            // DD-MM-YYYY
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
    }
    return new Date(dateStr);
};

export const getEventStartDateTime = (event: any) => {
    const date = parseEventDate(event.eventDate);
    if (event.startTime) {
        const [hours, minutes] = event.startTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
    } else {
        date.setHours(0, 0, 0, 0);
    }
    return date;
};

export const getEventEndDateTime = (event: any) => {
    const date = parseEventDate(event.eventDate);
    if (event.endTime) {
        const [hours, minutes] = event.endTime.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
    } else {
        date.setHours(23, 59, 59, 999);
    }
    return date;
};

export default function UpcomingEvents({ events }: EventProps) {
    const t = useTranslations("Events.displayEvents");

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
                    className="h-11 rounded-l-full"
                />
                <Button className="h-11 rounded-r-full px-6">
                    {t("search")}
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-3 items-center w-full">
                {/* Event Type */}
                <Select key={`type-${resetKey}`} value={typeFilter} onValueChange={(v) => setTypeFilter(v as EventType)}>
                    <SelectTrigger className="h-10 rounded-full w-full px-4">
                        <SelectValue placeholder={t("eventType")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="environmental_seminar">{t("environmental_seminar")}</SelectItem>
                        <SelectItem value="community_cleanup">{t("community_cleanup")}</SelectItem>
                        <SelectItem value="sustainable_brands_showcase">{t("sustainable_brands_showcase")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Date */}
                <Select key={`date-${resetKey}`} value={dateFilter} onValueChange={(v) => setDateFilter(v as any)}>
                    <SelectTrigger className="h-10 rounded-full w-full px-4">
                        <SelectValue placeholder={t("date")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">{t("today")}</SelectItem>
                        <SelectItem value="this_week">{t("thisWeek")}</SelectItem>
                        <SelectItem value="this_month">{t("thisMonth")}</SelectItem>
                    </SelectContent>
                </Select>

                {/* Price */}
                <Select key={`price-${resetKey}`} value={priceFilter} onValueChange={(v) => setPriceFilter(v as any)}>
                    <SelectTrigger className="h-10 rounded-full w-full px-4">
                        <SelectValue placeholder={t("price")} />
                    </SelectTrigger>
                    <SelectContent>
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
