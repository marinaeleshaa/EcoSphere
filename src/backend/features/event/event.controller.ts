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

  async createEvent(id: string, event: IEvent): Promise<IEvent> {
    return await this.eventService.createEvent(id, event);
  }

  async getEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventService.getEvent(id, eventId);
  }

  async updateEvent(id: string, event: Partial<IEvent>): Promise<IEvent> {
    return await this.eventService.updateEvent(id, event);
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventService.deleteEvent(id, eventId);
  }
}
