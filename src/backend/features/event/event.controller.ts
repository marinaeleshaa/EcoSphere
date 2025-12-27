import { inject, injectable } from "tsyringe";
import { IEvent } from "./event.model";
import type { IEventService } from "./event.service";
import {
  EventResponse,
  mapEventToEventData,
  EventResponsePopulated,
  mapEventToEventDataWithUser,
} from "./events.types";

@injectable()
class EventController {
  constructor(
    @inject("IEventService") private readonly eventService: IEventService
  ) {}

  async getEvents(
    isAdmin?: boolean,
    status?: "accepted" | "rejected" | "pending"
  ): Promise<EventResponsePopulated[]> {
    const response = await this.eventService.getEvents(isAdmin, status);
    const mappedData = response.map((event) =>
      mapEventToEventDataWithUser(event)
    );
    return mappedData;
  }

  async getEvent(id: string, eventId: string): Promise<EventResponse> {
    const response = await this.eventService.getEventById(id, eventId);
    return mapEventToEventData(response);
  }

  async getEventsByUserId(id: string): Promise<EventResponse[]> {
    const response = await this.eventService.getEventsByUserId(id);
    const mappedData = response.map((event) => mapEventToEventData(event));
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

  async acceptEvent(eventId: string): Promise<EventResponse> {
    const response = await this.eventService.acceptEvent(eventId);
    return mapEventToEventData(response);
  }

  async rejectEvent(eventId: string): Promise<EventResponse> {
    const response = await this.eventService.rejectEvent(eventId);
    return mapEventToEventData(response);
  }

  async attendEvent(id: string, eventId: string): Promise<EventResponse> {
    const response = await this.eventService.attendEvent(id, eventId);
    return mapEventToEventData(response);
  }
}

export default EventController;
