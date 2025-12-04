export const EVENT_TYPES = [
  'Music Festival', 'Conference', 'Workshop', 'Sporting Event',
  'Exhibition', 'Private Party', 'Other'
];

export interface ISubEvent {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
}

export interface IEventDetails {
    name: string;
    type: string;
    avatar?: string | FileList;
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