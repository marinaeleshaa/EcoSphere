import { IEventDetails } from "@/types/EventTypes";

export const formatTime = (
  time: string,
  locale: string
): string => {
  try {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch (e) {
    console.error(e);
    return time;
  }
};

export const formatDate = (
  dateString: string,
  locale: string
): string => {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch (e) {
    console.error(e);
    return dateString;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeEvent(event: any): IEventDetails {
  return {
    _id: event._id.toString(),
    name: event.name,
    type: event.type,
    locate: event.locate,
    description: event.description ?? "",
    avatar: event.avatar ?? "",
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    capacity: Number(event.capacity),
    ticketType: event.ticketType,
    ticketPrice: Number(event.ticketPrice),
    sections: event.sections ?? [],
  };
}

export function formatDateForInput(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}
