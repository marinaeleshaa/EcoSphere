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
import AddAttendBtn from "./AddAttendBtn";
import { useSession } from "next-auth/react";
import { EventStatus } from "@/types/EventTypes";

export default function EventCard({ event }: { event: any }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isOrganizerDetails =
    segments.length >= 2 &&
    segments[1] === "organizer" &&
    segments[2] === "details";
  const isEventOrganizer = session?.user?.id === event.user._id;
  const canAttend = !isOrganizerDetails && !isEventOrganizer;
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
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
          {isOrganizerDetails && (
            <div>
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <UpdateEventBtn id={event._id} detailscard={false} />
                <DeleteEventBtn id={event._id} detailscard={false} />
              </div>
              <div className="absolute top-4 left-4 z-20 ">
                <p
                  className={`capitalize py-1 px-3 rounded-full text-sm font-medium bg-primary text-primary-foreground
                      ${statusStyles[status]}
                      `}
                >
                  {status === "pending" ? "pending..." : status}
                </p>
              </div>
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
          <div className="flex  flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <FaCalendar className="text-primary" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <MdAccessTime className="text-primary" />
              <span>
                {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
              <FaLocationDot className="text-primary" />
              <span>{event.locate}</span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex m-2 gap-3">
          <EventDetailsCard
            event={event}
            isOrganizerDetails={isOrganizerDetails}
            canAttend={canAttend}
            userId={session?.user?.id || ""}
          />
          {!isOrganizerDetails && canAttend && (
            <AddAttendBtn
              eventId={event._id}
              isFree={event.ticketPrice === 0}
              attenders={event.attenders ?? []}
              userId={session?.user?.id || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
}
