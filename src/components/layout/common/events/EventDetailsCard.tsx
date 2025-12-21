/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { IoClose } from "react-icons/io5";
import { ISubEvent } from "@/types/EventTypes";
import UpdateEventBtn from "../../Dashboard/Events/DisplayEvents/UpdateEventBtn";
import DeleteEventBtn from "../../Dashboard/Events/DisplayEvents/DeleteEventBtn";
import AddAttendBtn from "./AddAttendBtn";
import { FaUserTie } from "react-icons/fa6";
import { useTranslations, useLocale } from "next-intl";
export default function EventDetailsCard({
  event,
  isOrganizerDetails,
  isEventOrganizer,
  canAttend,
  userId,
}: {
  event: any;
  canAttend: boolean;
  isOrganizerDetails: boolean;
  isEventOrganizer: boolean;
  userId: string | "";
}) {
  const t = useTranslations("Events.displayEvents.EventCardDetails");
  const locale = useLocale();
  return (
    <Dialog>
      <DialogTrigger className="flex-1 py-3 rounded-xl border border-primary font-semibold text-sm hover:bg-primary/10 transition cursor-pointer">
        {t("viewDetails")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
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
                  className="absolute top-4 ltr:right-4 rtl:left-4 bg-background/80 hover:bg-background rounded-full p-2 shadow"
                >
                  <IoClose className="size-5" />
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
                      {t("date")}
                    </p>
                    <p className="font-semibold">
                      {formatDate(event.eventDate, locale)}
                    </p>
                  </div>
                </div>
                {/* Time */}
                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <FcClock className="size-8" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      {t("time")}
                    </p>
                    <p className="font-semibold">
                      {formatTime(event.startTime, locale)} –{" "}
                      {formatTime(event.endTime, locale)}
                    </p>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start gap-3 rounded-xl border p-4 sm:col-span-2">
                  <FaLocationDot className="size-6 text-primary" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      {t("location")}
                    </p>
                    <p className="font-semibold">{event.locate}</p>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("about")}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Capacity */}
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("capacity")}
                  </p>
                  <p className="text-xl font-bold">{event.capacity}</p>
                </div>

                {/* Attenders */}
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("attenders")}
                  </p>
                  <p className="text-xl font-bold">
                    {event.attenders?.length || 0}
                  </p>
                </div>

                {/* Price */}
                <div className="rounded-xl border p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">
                    {t("ticketPrice")}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {event.ticketPrice === 0
                      ? t("free")
                      : `${event.ticketPrice} EGP`}
                  </p>
                </div>
                {/* organizer */}
                {!isOrganizerDetails && (
                  <div className="md:col-span-3 flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <FaUserTie className="text-primary" />
                    </div>

                    {isEventOrganizer ? (
                      <span className="text-xs text-primary font-semibold">
                        {t("organizer")}
                      </span>
                    ) : (
                      <div className="flex flex-col text-sm">
                        <span className="font-medium text-foreground">
                          {event.user?.firstName}
                        </span>
                        {canAttend && (
                          <span className="text-muted-foreground text-xs">
                            {event.user?.email}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Sections / Schedule */}
              {event.sections && event.sections.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold">{t("schedule")}</h3>
                  {event.sections.map((section: ISubEvent, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{section.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(section.startTime, locale)} –{" "}
                          {formatTime(section.endTime, locale)}
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
              <div className="sticky bottom-0 bg-background py-4">
                {isOrganizerDetails ? (
                  <div className="grid grid-cols-2 w-full  gap-4">
                    <UpdateEventBtn id={event._id} detailscard={true} />
                    <DeleteEventBtn id={event._id} detailscard={true} />
                  </div>
                ) : (
                  canAttend && (
                    <div className="flex gap-4">
                      <AddAttendBtn
                        eventId={event._id}
                        ticketPrice={event.ticketPrice}
                        attenders={event.attenders ?? []}
                        userId={userId}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
