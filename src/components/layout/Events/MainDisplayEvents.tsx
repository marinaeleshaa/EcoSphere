/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { EventProps } from "@/types/EventTypes";
// import React, { useState } from "react";
// import { SearchIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ButtonGroup } from "@/components/ui/button-group";
// import { Input } from "@/components/ui/input";
// import EventCard from "../common/events/EventCard";
// import { useTranslations } from "next-intl";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function MainDisplayEvents({ events }: Readonly<EventProps>) {
//   const t = useTranslations("Events.MainDisplayEvents");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
//   const now = new Date();
//   const filteredEvents = events
//     .filter((event) => event.isAccepted === true)
//     .filter((event) =>
//       event.name.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .filter((event) => new Date(event.eventDate) >= now)
//     .filter((event) => {
//       if (priceFilter === "free") return event.ticketPrice === 0;
//       if (priceFilter === "paid") return event.ticketPrice > 0;
//       return true;
//     })
//     .sort(
//       (a, b) =>
//         new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
//     );
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };
//   return (
//     <div className="flex flex-col gap-4 py-5">
//       <div className="w-full gap-4 flex justify-center md:justify-end">
//         {/* Price Filter Select */}
//         <Select value={priceFilter} onValueChange={(value) => setPriceFilter(value as "all" | "free" | "paid")}>
//           <SelectTrigger className="w-full md:w-45">
//             <SelectValue placeholder={t("filterByPrice")} />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">{t("all")}</SelectItem>
//             <SelectItem value="free">{t("free")}</SelectItem>
//             <SelectItem value="paid">{t("paid")}</SelectItem>
//           </SelectContent>
//         </Select>
//         <ButtonGroup className="rtl:flex-row-reverse w-[80%] md:w-fit">
//           <Input
//             placeholder={t("searchPlaceholder")}
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//           />
//           <Button
//             aria-label={t("search")}
//             className="rounded-l-none border-l-0 px-3"
//           >
//             <SearchIcon className="h-4 w-4" />
//           </Button>
//         </ButtonGroup>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredEvents.map((event) => (
//           <EventCard key={event._id} event={event} />
//         ))}
//       </div>
//       {filteredEvents.length === 0 && (
//         <div className="text-center w-full p-8 rounded-xl shadow-md text-muted-foreground border-2 border-primary">
//           <p>{t("emptyTitle")}</p>
//           <p>{t("emptySubtitle")}</p>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { EventProps } from "@/types/EventTypes";
import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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

const getEventStartDateTime = (event: any) => {
  const date = parseEventDate(event.eventDate);
  if (event.startTime) {
    const [hours, minutes] = event.startTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
};

export default function MainDisplayEvents({ events }: Readonly<EventProps>) {
  const t = useTranslations("Events.MainDisplayEvents");

  const [resetKey, setResetKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"free" | "paid" | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<EventType | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<"today" | "this_week" | "this_month" | undefined>(undefined);

  const now = new Date();

  const filteredEvents = events
    .filter((event) => event.isAccepted === true) 
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
      if (dateFilter === "today") return start.toDateString() === now.toDateString();
      if (dateFilter === "this_week") {
        const weekEnd = new Date();
        weekEnd.setDate(now.getDate() + 7);
        return start >= now && start <= weekEnd;
      }
      if (dateFilter === "this_month") {
        return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
      }
      return true;
    })
    .sort((a, b) => getEventStartDateTime(a).getTime() - getEventStartDateTime(b).getTime());

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 py-5">
      <h2 className="text-3xl capitalize text-center md:text-4xl font-bold mb-4">
        {t("upcomingEvents")}
      </h2>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center w-full">
        {/* Event Type */}
        <Select key={`type-${resetKey}`} value={typeFilter} onValueChange={(v) => setTypeFilter(v as EventType)}>
          <SelectTrigger className="h-10 rounded-full w-full px-4 rtl:flex-row-reverse">
            <SelectValue placeholder={t("eventType")} />
          </SelectTrigger>
          <SelectContent >
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
          <SelectTrigger className="h-10 rounded-full w-full px-4  rtl:flex-row-reverse">
            <SelectValue placeholder={t("price")} />
          </SelectTrigger>
          <SelectContent className=" text-right">
            <SelectItem  value="free">{t("free")}</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5 gap-6">
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
    </div>
  );
}
