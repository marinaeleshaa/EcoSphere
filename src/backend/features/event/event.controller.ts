import { inject, injectable } from "tsyringe";
import { IEvent, IsEventPopulated } from "./event.model";
import type { IEventService } from "./event.service";
import { EventResponse, mapEventToEventData } from "./events.types";

@injectable()
class EventController {
  constructor(
    @inject("IEventService") private readonly eventService: IEventService,
  ) {}

  async getEvents(): Promise<EventResponse[]> {
    const response = await this.eventService.getEvents();
    const mappedData = response.map((item) =>
      mapEventToEventData(item as IsEventPopulated),
    );
    return mappedData;
  }

  async getEvent(id: string, eventId: string): Promise<EventResponse> {
    const response = await this.eventService.getEventById(id, eventId);
    return mapEventToEventData(response as IsEventPopulated);
  }

  async getEventsByUserId(id: string): Promise<EventResponse[]> {
    const response = await this.eventService.getEventsByUserId(id);
    const mappedData = response.map((item) =>
      mapEventToEventData(item as IsEventPopulated),
    );
    return mappedData;
  }

  async createEvent(id: string, event: IEvent): Promise<EventResponse> {
    const response = await this.eventService.createEvent(id, event);
    return mapEventToEventData(response as IsEventPopulated);
  }

  async updateEvent(
    id: string,
    event: Partial<IEvent>,
  ): Promise<EventResponse> {
    const response = await this.eventService.updateEvent(id, event);
    return mapEventToEventData(response as IsEventPopulated);
  }

  async deleteEvent(id: string, eventId: string): Promise<EventResponse> {
    const response = await this.eventService.deleteEvent(id, eventId);
    return mapEventToEventData(response as IsEventPopulated);
  }

  async acceptEvent(eventId: string): Promise<EventResponse> {
    const response = await this.eventService.acceptEvent(eventId);
    return mapEventToEventData(response as IsEventPopulated);
  }

  async rejectEvent(eventId: string): Promise<EventResponse> {
    const response = await this.eventService.rejectEvent(eventId);
    return mapEventToEventData(response as IsEventPopulated);
  }

  async attendEvent(id: string, eventId: string): Promise<EventResponse> {
    const response = await this.eventService.attendEvent(id, eventId);
    return mapEventToEventData(response as IsEventPopulated);
  }
}

export default EventController;
