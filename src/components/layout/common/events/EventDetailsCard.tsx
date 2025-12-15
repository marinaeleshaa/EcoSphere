import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FcCalendar } from "react-icons/fc";
import { FcClock } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/frontend/utils/Event";
import { FaLocationDot } from "react-icons/fa6";
import { ISubEvent } from "@/types/EventTypes";
import UpdateEventBtn from "./UpdateEventBtn";
import DeleteEventBtn from "./DeleteEventBtn";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EventDetailsCard({event,state,}: {event: any;state: boolean;}) {
  return (
    <Dialog>
      <DialogTrigger className="flex-1 py-3 rounded-xl border border-primary font-semibold text-sm hover:bg-primary/10 transition">
        View Details
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl">
            {/* Header Image */}
            <div className="relative h-60">
              <Image
                src={event.avatar?.url || "/events/defaultImgEvent.png"}
                alt={event.name}
                fill
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
              {/* Close Button */}
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="absolute top-4 right-4 bg-background/80 hover:bg-background rounded-full p-2 shadow"
                >
                  Close
                </Button>
              </DialogClose>
              {/* Title */}
              <div className="absolute bottom-4 left-6 right-6">
                <h1 className="text-2xl font-bold text-white">{event.name}</h1>
                <p className="text-sm text-white/80">{event.type}</p>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <FcCalendar className="size-8" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Date
                    </p>
                    <p className="font-semibold">
                      {formatDate(event.eventDate)}
                    </p>
                  </div>
                </div>
                {/* Time */}
                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <FcClock className="size-8" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Time
                    </p>
                    <p className="font-semibold">
                      {event.startTime} – {event.endTime}
                    </p>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start gap-3 rounded-xl border p-4 sm:col-span-2">
                  <FaLocationDot className="size-6 text-primary" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Location
                    </p>
                    <p className="font-semibold">{event.locate}</p>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">About this event</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Capacity */}
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Capacity
                  </p>
                  <p className="text-xl font-bold">{event.capacity}</p>
                </div>

                {/* Attenders */}
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Attenders
                  </p>
                  <p className="text-xl font-bold">
                    {event.attenders?.length || 0}
                  </p>
                </div>

                {/* Price */}
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    Ticket Price
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {event.ticketPrice === 0
                      ? "Free"
                      : `${event.ticketPrice} EGP`}
                  </p>
                </div>
              </div>
              {/* Sections / Schedule */}
              {event.sections && event.sections.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">Schedule</h3>
                  {event.sections.map((section: ISubEvent, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{section.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(section.startTime)} –
                          {formatTime(section.endTime)}
                        </span>
                      </div>
                      {section.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {section.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Footer Actions */}
              <div className="sticky bottom-1 bg-background pt-4">
                {state ? (
                  <div className="grid grid-cols-2 w-full  gap-4">
                    <UpdateEventBtn id={event._id} detailscard={true} />
                    <DeleteEventBtn id={event._id} detailscard={true} />
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button className="flex-1 py-3 capitalize rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition">
                      Attend Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
