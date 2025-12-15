import { IEventDetails } from "@/types/EventTypes";

export const formatTime = (time: string): string => {
  try {
    // Assuming time is in "HH:MM" format (24-hour)
    const [hours, minutes] = time.split(":");
    const date = new Date(0, 0, 0, +hours, +minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    console.error(e);
    return time; 
  }
};
// Function to format the date
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
