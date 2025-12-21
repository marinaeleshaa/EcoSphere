"use client";

import { act, useEffect, useState } from "react";
import { Mail, Phone, MapPin, Ticket, Check, X, User } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { useTranslations } from "next-intl";
import { IEventDetails } from "@/types/EventTypes";
import { toast } from "sonner";

const EventCard = () => {
  const t = useTranslations("Admin.Events.card");
  const [events, setEvents] = useState<IEventDetails[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const { data } = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleAccept = async (id: string) => {
    const response = await fetch("/api/events/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, action: "accept" }),
    });

    if (!response.ok) {
      console.error("Failed to accept event");
      toast.error(t("toasts.acceptError"));
    }
    setEvents(
      events.map((e) =>
        e._id === id ? { ...e, isAccepted: true, isEventNew: false } : e
      )
    );
  };

  const handleDeny = async (id: string) => {
    const response = await fetch("/api/events/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, action: "deny" }),
    });

    if (!response.ok) {
      console.error("Failed to deny event");
      toast.error(t("toasts.denyError"));
    }
    setEvents(
      events.map((e) =>
        e._id === id ? { ...e, isAccepted: false, isEventNew: false } : e
      )
    );
  };

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("Loading")}</p>
      </div>
    );
  }

  return (
    <div className=" bg-secondary rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-white/10 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-primary to-primary/80 p-4">
                <h3 className="text-xl font-bold text-primary-foreground truncate">
                  {event.name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("organizer")}
                    </p>
                    <p className="text-sm text-foreground/60 truncate">
                      {event.user?.firstName || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("email")}
                    </p>
                    <p className="text-sm text-foreground/60 truncate">
                      {event.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("phone")}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {event.user?.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("location")}
                    </p>
                    <p className="text-sm text-foreground/60">{event.locate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("ticketPrice")}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {event.ticketPrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5">
                {event.isAccepted === false && event.isEventNew === true ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeny(event._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      {t("actions.deny")}
                    </button>
                    <button
                      onClick={() => handleAccept(event._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      {t("actions.accept")}
                    </button>
                  </div>
                ) : (
                  <div
                    className={`text-center py-2.5 px-4 rounded-lg font-medium ${
                      event.isAccepted === true && event.isEventNew === false
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.isAccepted === true && event.isEventNew === false
                      ? "✓ " + t("status.accepted")
                      : "✗ " + t("status.denied")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
};

export default EventCard;
