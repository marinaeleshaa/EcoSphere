import { inject, injectable } from "tsyringe";
import { IEvent } from "../user/user.model";
import type { IEventService } from "./event.service";
import { EventResponse, mapEventToEventData } from "./events.types";

@injectable()
class EventController {
	constructor(
		@inject("IEventService") private readonly eventService: IEventService
	) {}

	async getEvents(): Promise<EventResponse[]> {
		const response = await this.eventService.getEvents();
		const mappedData = response.map((item) => mapEventToEventData(item));
		return mappedData;
	}

	async getEvent(id: string, eventId: string): Promise<EventResponse> {
		const response = await this.eventService.getEvent(id, eventId);
		return mapEventToEventData(response);
	}

	async getEventsByUserId(id: string): Promise<EventResponse[]> {
		const response = await this.eventService.getEventsByUserId(id);
		const mappedData = response.map((item) => mapEventToEventData(item));
		return mappedData;
	}

	async createEvent(id: string, event: IEvent): Promise<EventResponse> {
		const response = await this.eventService.createEvent(id, event);
		return mapEventToEventData(response);
	}

	async updateEvent(
		id: string,
		event: Partial<IEvent>
	): Promise<EventResponse> {
		const response = await this.eventService.updateEvent(id, event);
		return mapEventToEventData(response);
	}

	async deleteEvent(id: string, eventId: string): Promise<EventResponse> {
		const response = await this.eventService.deleteEvent(id, eventId);
		return mapEventToEventData(response);
	}
}

export default EventController;
