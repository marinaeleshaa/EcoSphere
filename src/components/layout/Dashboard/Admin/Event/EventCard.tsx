"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Ticket, Check, X, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { IEventDetails } from "@/types/EventTypes";
import { toast } from "sonner";

const EventCard = () => {
  const t = useTranslations("Admin.Events");
  const [events, setEvents] = useState<IEventDetails[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const url = status ? `/api/events?status=${status}` : "/api/events";
      const response = await fetch(url);
      const { data } = await response.json();
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, [status]);

  const handleAccept = async (id: string) => {
    const response = await fetch("/api/events/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, action: "accept" }),
    });

    if (!response.ok) {
      console.error("Failed to accept event");
      toast.error(t("card.toasts.acceptError"));
    } else {
      toast.success(t("card.toasts.accepted"));
      setEvents(
        events.map((e) =>
          e._id === id ? { ...e, isAccepted: true, isEventNew: false } : e
        )
      );
    }
  };

  const handleDeny = async (id: string) => {
    const response = await fetch("/api/events/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id, action: "deny" }),
    });

    if (!response.ok) {
      console.error("Failed to deny event");
      toast.error(t("card.toasts.denyError"));
    } else {
      toast.success(t("card.toasts.denied"));
      setEvents(
        events.map((e) =>
          e._id === id ? { ...e, isAccepted: false, isEventNew: false } : e
        )
      );
    }
  };

  return (
    <div className=" bg-secondary rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["", "pending", "accepted", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                status === s
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-white dark:bg-white/10 text-muted-foreground hover:bg-gray-50 dark:hover:bg-white/20"
              }`}
            >
              {t(`filter.${s || "all"}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground animate-pulse">
              {t("card.Loading")}
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white/30 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10">
            <p className="text-muted-foreground text-lg italic">
              {status
                ? t("card.noEventsInFilter") ||
                  "No events found for this filter"
                : t("card.Loading")}
            </p>
          </div>
        ) : (
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
                        {t("card.organizer")}
                      </p>
                      <p className="text-sm text-foreground/60 truncate">
                        {event.user?.name || event.user?.firstName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("card.email")}
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
                        {t("card.phone")}
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
                        {t("card.location")}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {event.locate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {t("card.ticketPrice")}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {event.ticketPrice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5">
                  {(event.isAccepted === false && event.isEventNew === true) ||
                  (event.isAccepted === undefined &&
                    event.isEventNew === undefined) ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeny(event._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        {t("card.actions.deny")}
                      </button>
                      <button
                        onClick={() => handleAccept(event._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        {t("card.actions.accept")}
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`text-center py-2.5 px-4 rounded-lg font-medium ${
                        event.isAccepted === true
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.isAccepted === true
                        ? "✓ " + t("card.status.accepted")
                        : "✗ " + t("card.status.denied")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
