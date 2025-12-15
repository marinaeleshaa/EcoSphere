import { ISubEvent } from "@/types/EventTypes";
import { IEvent } from "../user/user.model";

export type EventResponse = {
  attenders?: string[];
  events?: any;
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
};

export const mapEventToEventData = (event: IEvent): EventResponse => {
  return {
    ...event,
    eventDate: `${event.eventDate}`,
    _id: `${event._id}`,
  };
};
