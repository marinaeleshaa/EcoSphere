import { ISubEvent } from "@/types/EventTypes";
import { EventPopulated } from "./event.model";

export type EventResponse = {
  _id: string;
  name: string;
  type: string;
  avatar?: { url?: string; key: string };
  description?: string;
  locate: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  ticketPrice: number;
  sections?: ISubEvent[];
  attenders?: string[];
  isAccepted: boolean;
  isEventNew: boolean;
  user?: {
    _id: string;
    firstName?: string;
    email?: string;
    phoneNumber?: string;
  };
};

export const mapEventToEventData = (event: EventPopulated): EventResponse => {
  return {
    _id: event._id.toString(),
    name: event.name,
    type: event.type,
    avatar: event.avatar,
    description: event.description,
    locate: event.locate,
    eventDate: event.eventDate.toISOString(),
    startTime: event.startTime,
    endTime: event.endTime,
    capacity: event.capacity,
    ticketPrice: event.ticketPrice,
    sections: event.sections,
    attenders: event.attenders?.map(String),
    isAccepted: event.isAccepted,
    isEventNew: event.isEventNew,
    user: {
      _id: event.owner._id.toString(),
      firstName:
        (event.owner as any).firstName || (event.owner as any).name || "",
      email: event.owner.email,
      phoneNumber: event.owner.phoneNumber,
    },
  };
};
