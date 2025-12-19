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
  isAccepted: boolean;
  isEventNew: boolean;
  user?: {
    _id: string;
    firstName: string;
    email: string;
    phoneNumber: string;
  };
};

export const mapEventToEventData = (event: IEvent): EventResponse => {
  return {
    ...event,
    attenders: event.attenders?.map((attender) => `${attender}`),
    user: {
      _id: `${event.user?._id}`,
      firstName: `${event.user?.firstName}`,
      email: `${event.user?.email}`,
      phoneNumber: `${event.user?.phoneNumber}`,
    },
    eventDate: `${event.eventDate}`,
    _id: `${event._id}`,
  };
};
