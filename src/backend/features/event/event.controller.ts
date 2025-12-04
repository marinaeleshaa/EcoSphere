import { inject, injectable } from "tsyringe";
import { IEvent } from "../user/user.model";
import type { IEventService } from "./event.service";

@injectable()
class EventController {
  constructor(
    @inject("IEventService") private readonly eventService: IEventService
  ) {}

  async getEvents(): Promise<IEvent[]> {
    return await this.eventService.getEvents();
  }

  async getEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventService.getEvent(id, eventId);
  }

  async getEventsByUserId(id: string): Promise<IEvent[]> {
    return await this.eventService.getEventsByUserId(id);
  }

  async createEvent(id: string, event: IEvent): Promise<IEvent> {
    return await this.eventService.createEvent(id, event);
  }

  async updateEvent(id: string, event: Partial<IEvent>): Promise<IEvent> {
    return await this.eventService.updateEvent(id, event);
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventService.deleteEvent(id, eventId);
  }
}

export default EventController;
