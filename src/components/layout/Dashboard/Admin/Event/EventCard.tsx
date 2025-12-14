"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Ticket, Check, X,User  } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

const EventCard = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Summer Music Festival",
      organizer: "Music Fest",
      email: "contact@summerfest.com",
      phone: "+1 (555) 123-4567",
      location: "Central Park, New York",
      ticketPrice: "$50",
      status: "pending",
    },
    {
      id: 2,
      name: "Tech Conference 2024",
      organizer: "Music Fest",
      email: "info@techconf.com",
      phone: "+1 (555) 234-5678",
      location: "Convention Center, San Francisco",
      ticketPrice: "$150",
      status: "pending",
    },
    {
      id: 3,
      name: "Food & Wine Expo",
      organizer: "Music Fest",
      email: "hello@foodexpo.com",
      phone: "+1 (555) 345-6789",
      location: "Grand Hotel, Chicago",
      ticketPrice: "$75",
      status: "pending",
    },
  ]);

  const handleAccept = (id: number) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "accepted" } : event
      )
    );
  };

  const handleDeny = (id: number) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "denied" } : event
      )
    );
  };

  return (
    <div className=" bg-secondary rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
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
                    <p className="text-xs text-muted-foreground mb-1">Organizer</p>
                    <p className="text-sm text-foreground/60 truncate">
                      {event.organizer}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm text-foreground/60 truncate">
                      {event.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="text-sm text-foreground/60">{event.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="text-sm text-foreground/60">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      Ticket Price
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {event.ticketPrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5">
                {event.status === "pending" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeny(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Deny
                    </button>
                    <button
                      onClick={() => handleAccept(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                  </div>
                ) : (
                  <div
                    className={`text-center py-2.5 px-4 rounded-lg font-medium ${
                      event.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.status === "accepted" ? "✓ Accepted" : "✗ Denied"}
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
