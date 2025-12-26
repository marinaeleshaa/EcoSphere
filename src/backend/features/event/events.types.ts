import { ISubEvent } from "@/types/EventTypes";
import { IEvent } from "./event.model";
import { IUser } from "../user/user.model";
import { IRestaurant } from "../restaurant/restaurant.model";

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
    email: string;
    name: string;
  };
};

export const mapEventToEventData = (event: IEvent): EventResponse => {
  return {
    _id: event._id.toString(),
    name: event.name,
    type: event.type,
    avatar: event.avatar ? JSON.parse(JSON.stringify(event.avatar)) : undefined,
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
    user: event.user
      ? {
          _id: (event.owner || (event.user as any)?._id)?.toString() || "",
          email: event.user.email,
          name:
            (event.user as any).name ||
            `${(event.user as any).firstName} ${(event.user as any).lastName}`,
        }
      : undefined,
  };
};

export type EventResponsePopulated = EventResponse;

export const mapEventToEventDataWithUser = (
  event: IEvent
): EventResponsePopulated => {
  return mapEventToEventData(event);
};
