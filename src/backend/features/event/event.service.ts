import { inject, injectable } from "tsyringe";
import { IEvent } from "../user/user.model";
import type { IEventRepository } from "./event.repository";

export interface IEventService {
  getEvents: () => Promise<IEvent[]>;
  getEvent: (id: string, eventId: string) => Promise<IEvent>;
  createEvent: (id: string, event: IEvent) => Promise<IEvent>;
  updateEvent: (id: string, event: Partial<IEvent>) => Promise<IEvent>;
  deleteEvent: (id: string, eventId: string) => Promise<IEvent>;
}

@injectable()
class EventService {
  constructor(
    @inject("IEventRepository")
    private readonly eventRepository: IEventRepository
  ) {}

  async getEvents(): Promise<IEvent[]> {
    return await this.eventRepository.getEvents();
  }

  async getEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventRepository.getEvent(id, eventId);
  }

  async createEvent(id: string, event: IEvent): Promise<IEvent> {
    return await this.eventRepository.createEvent(id, event);
  }

  async updateEvent(id: string, event: Partial<IEvent>): Promise<IEvent> {
    return await this.eventRepository.updateEvent(id, event);
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventRepository.deleteEvent(id, eventId);
  }
}
