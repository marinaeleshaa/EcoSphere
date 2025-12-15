import { EventResponse } from "@/backend/features/event/events.types";

export interface MetricData {
  id: number;
  title: string;
  value: string;
  change: string | null;
}

export const EVENT_TYPES = [
  "Music Festival",
  "Conference",
  "Workshop",
  "Sporting Event",
  "Exhibition",
  "Private Party",
  "Other",
];

export interface ISubEvent {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export interface IEventDetails {
  _id: string;
  name: string;
  type: string;
  avatar?: File | { url: string; key: string } | null;
  description?: string;
  locate: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  ticketType: "Priced" | "Free";
  ticketPrice: number;
  sections?: ISubEvent[];
}

export interface EventProps {
  events: EventResponse[];
}

export type EventListItemProps = Pick<
  IEventDetails,
  "_id" | "name" | "eventDate" | "startTime" | "endTime" | "locate"
> & {
  avatar?: { url: string; key: string } | string;
};
