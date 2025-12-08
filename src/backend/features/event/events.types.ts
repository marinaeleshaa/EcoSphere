import { ISubEvent } from "@/types/EventTypes";
import { IEvent } from "../user/user.model";

export type EventResponse = {
	_id: string;
	name: string;
	type: string;
	avatar?: string;
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
		_id: `${event._id}`,
		name: event.name,
		type: event.type,
		avatar: event.avatar,
		description: event.description,
		locate: event.locate,
		eventDate: `${event.eventDate}`,
		startTime: `${event.startTime}`,
		endTime: `${event.endTime}`,
		capacity: event.capacity,
		ticketPrice: event.ticketPrice,
		sections: event.sections,
	};
};
