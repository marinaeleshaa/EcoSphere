import { inject, injectable } from "tsyringe";
import { IEvent, EventPopulated } from "./event.model";
import type { IEventRepository } from "./event.repository";

export interface IEventService {
  getEvents: () => Promise<EventPopulated[]>;
  getEventById: (id: string, eventId: string) => Promise<EventPopulated>;
  getEventsByUserId: (id: string) => Promise<EventPopulated[]>;
  createEvent: (
    user: { id: string; role: string },
    event: IEvent,
  ) => Promise<EventPopulated>;
  updateEvent: (id: string, event: Partial<IEvent>) => Promise<EventPopulated>;
  deleteEvent: (id: string, eventId: string) => Promise<EventPopulated>;
  acceptEvent: (eventId: string) => Promise<EventPopulated>;
  rejectEvent: (eventId: string) => Promise<EventPopulated>;
  attendEvent: (id: string, eventId: string) => Promise<EventPopulated>;
}

@injectable()
class EventService {
  constructor(
    @inject("IEventRepository")
    private readonly eventRepository: IEventRepository,
  ) {}

  async getEvents(): Promise<EventPopulated[]> {
    return await this.eventRepository.getEvents();
  }

  async getEventById(id: string, eventId: string): Promise<EventPopulated> {
    return await this.eventRepository.getEvent(id, eventId);
  }

  async getEventsByUserId(id: string): Promise<EventPopulated[]> {
    return await this.eventRepository.getEventsByUserId(id);
  }

  async createEvent(
    user: { id: string; role: string },
    data: IEvent,
  ): Promise<EventPopulated> {
    const createdEvent = await this.eventRepository.createEvent(user, data);

    if (!createdEvent) {
      throw new Error(
        `User ${user.id} not found or event could not be created.`,
      );
    }

    return createdEvent;
  }

  async updateEvent(
    userId: string,
    event: Partial<IEvent>,
  ): Promise<EventPopulated> {
    const updated = await this.eventRepository.updateEvent(userId, event);

    if (!updated) {
      throw new Error(`Event ${event._id} not found for user ${userId}.`);
    }

    return updated;
  }

  async deleteEvent(id: string, eventId: string): Promise<EventPopulated> {
    return await this.eventRepository.deleteEvent(id, eventId);
  }

  async acceptEvent(eventId: string): Promise<EventPopulated> {
    return await this.eventRepository.acceptEvent("", eventId);
  }

  async rejectEvent(eventId: string): Promise<EventPopulated> {
    return await this.eventRepository.rejectEvent("", eventId);
  }

  async attendEvent(id: string, eventId: string): Promise<EventPopulated> {
    return await this.eventRepository.attendEvent(id, eventId);
  }
}

export default EventService;
