"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { MdAccessTime } from "react-icons/md";
import { formatDate, formatTime } from "@/frontend/utils/Event";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import EventDetailsCard from "./EventDetailsCard";
import DeleteEventBtn from "../../Dashboard/Events/DisplayEvents/DeleteEventBtn";
import UpdateEventBtn from "../../Dashboard/Events/DisplayEvents/UpdateEventBtn";
import { usePathname } from "next/navigation";
import AddAttendBtn from "../../Events/AddAttendBtn";
import { useSession } from "next-auth/react";
import { EventStatus } from "@/types/EventTypes";
import { FaUserTie } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function EventCard({ event }: { event: any }) {
  const t = useTranslations("Events.displayEvents.EventCard");
  const locale = useLocale();
  const { data: session } = useSession();
  const pathname = usePathname();

  // --- Locale-aware route parsing ---
  const segments = pathname.split("/").filter(Boolean);
  const locales = ["en", "ar"]; // Add other locales if needed
  const firstSegmentIsLocale = locales.includes(segments[0]);
  const routeSegment = firstSegmentIsLocale ? segments[1] : segments[0];
  const secondSegment = firstSegmentIsLocale ? segments[2] : segments[1];

  // --- Route flags ---
  const isEventsPage = routeSegment === "events";
  const isOrganizerUpcoming = routeSegment === "organizer" && secondSegment === "upcomingEvents";
  const isOrganizerHistory = routeSegment === "organizer" && secondSegment === "history";

  const status: EventStatus = event.isAccepted
    ? "approved"
    : event.isEventNew
      ? "pending"
      : "rejected";

  const statusStyles: Record<EventStatus, string> = {
    approved: "bg-green-600 text-white",
    pending: "bg-yellow-500 text-white",
    rejected: "bg-red-600 text-white",
  };

  return (
    <div className="col-span-1 flex justify-center">
      <div className="w-full flex flex-col max-w-sm rounded-2xl overflow-hidden border border-primary/20 bg-background shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">

        {/* Image Header */}
        <div className="relative h-52">
          <Image
            src={event.avatar?.url || "/events/defaultImgEvent.png"}
            alt={event.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

          {/* Edit/Delete buttons & status for organizer upcoming */}
          {isOrganizerUpcoming && (
            <div>
              <div className="absolute top-4 ltr:right-4 rtl:left-4 z-20 flex gap-2">
                <UpdateEventBtn id={event._id} detailscard={false} />
                <DeleteEventBtn id={event._id} detailscard={false} />
              </div>
              <div className="absolute top-4 ltr:left-4 rtl:right-4 z-20">
                <p
                  className={`capitalize py-1 px-3 rounded-full text-sm font-medium bg-primary text-primary-foreground
                    ${statusStyles[status]}`}
                >
                  {t(`status.${status}`)}
                </p>
              </div>
            </div>
          )}

          {/* Delete button only on organizer history */}
          {isOrganizerHistory && (
            <div className="absolute top-4 ltr:right-4 rtl:left-4 z-20">
              <DeleteEventBtn id={event._id} detailscard={false} />
            </div>
          )}

          {/* Event Name */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
              {event.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 space-y-4">
          <div className="flex flex-wrap gap-1.5 text-sm">
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <FaCalendar className="text-primary" />
              <span>{formatDate(event.eventDate, locale)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <MdAccessTime className="text-primary" />
              <span>
                {formatTime(event.startTime, locale)} – {formatTime(event.endTime, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <FaLocationDot className="text-primary" />
              <span>{event.locate}</span>
            </div>

            {/* Organizer info only on /events */}
            {isEventsPage && (
              <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                <FaUserTie className="text-primary" />
                <div className="flex flex-col text-sm">
                  <span className="font-medium text-foreground">{event.user?.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex m-2 gap-3">
          {/* Details card */}
          <EventDetailsCard
            event={event}
            userId={session?.user?.id || ""}
          />

          {/* Attend button only on /events */}
          {isEventsPage && (
            <AddAttendBtn
              eventId={event._id}
              ticketPrice={event.ticketPrice}
              attenders={event.attenders ?? []}
              userId={session?.user?.id || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
}
