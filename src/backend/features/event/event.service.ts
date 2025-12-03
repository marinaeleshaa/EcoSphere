import { inject, injectable } from "tsyringe";
import { IEvent } from "../user/user.model";
import type { IEventRepository } from "./event.repository";

export interface IEventService {
  getEvents: () => Promise<IEvent[]>;
  getEvent: (id: string, eventId: string) => Promise<IEvent>;
  getEventsByUserId: (id: string) => Promise<IEvent[]>;
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

  async getEventsByUserId(id: string): Promise<IEvent[]> {
    return await this.eventRepository.getEventsByUserId(id);
  }

  async createEvent(userId: string, data: IEvent): Promise<IEvent> {
    const createdEvent = await this.eventRepository.createEvent(userId, data);

    if (!createdEvent) {
      throw new Error(
        `User ${userId} not found or event could not be created.`
      );
    }

    return createdEvent;
  }

  async updateEvent(userId: string, event: Partial<IEvent>): Promise<IEvent> {
    const updated = await this.eventRepository.updateEvent(userId, event);

    if (!updated) {
      throw new Error(`Event ${event._id} not found for user ${userId}.`);
    }

    return updated;
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventRepository.deleteEvent(id, eventId);
  }
}

export default EventService;
