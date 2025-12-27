import { inject, injectable } from "tsyringe";
import { IEvent } from "./event.model";
import { IUser } from "../user/user.model";
import { IRestaurant } from "../restaurant/restaurant.model";
import type { IEventRepository } from "./event.repository";
import type { IUserService } from "../user/user.service";
import type { IRestaurantService } from "../restaurant/restaurant.service";
import { ImageService } from "@/backend/services/image.service";

export interface IEventService {
  getEvents: (
    isAdmin?: boolean,
    status?: "accepted" | "rejected" | "pending"
  ) => Promise<IEvent[]>;
  getEventById: (id: string, eventId: string) => Promise<IEvent>;
  getEventsByUserId: (id: string) => Promise<IEvent[]>;
  createEvent: (id: string, event: IEvent) => Promise<IEvent>;
  updateEvent: (id: string, event: Partial<IEvent>) => Promise<IEvent>;
  deleteEvent: (id: string, eventId: string) => Promise<IEvent>;
  acceptEvent: (eventId: string) => Promise<IEvent>;
  rejectEvent: (eventId: string) => Promise<IEvent>;
  attendEvent: (id: string, eventId: string) => Promise<IEvent>;
}

@injectable()
class EventService implements IEventService {
  constructor(
    @inject("IEventRepository")
    private readonly eventRepository: IEventRepository,
    @inject("IUserService")
    private readonly userService: IUserService,
    @inject("IRestaurantService")
    private readonly restaurantService: IRestaurantService,
    @inject("ImageService")
    private readonly imageService: ImageService
  ) {}

  private async attachSignedUrl(event: IEvent): Promise<IEvent> {
    if (event?.avatar?.key) {
      try {
        const url = await this.imageService.getSignedUrl(event.avatar.key);
        event.avatar.url = url;
      } catch (error) {
        console.error(
          `Failed to generate signed URL for event ${event._id}:`,
          error
        );
      }
    }
    return event;
  }

  private async getOwnerData(ownerId: string) {
    if (!ownerId) return null;

    try {
      // Try fetching as a user first
      const user = await this.userService.getById(ownerId);
      if (user) {
        return {
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
      }
    } catch (error) {
      // Not a user, try restaurant
      try {
        const restaurant = await this.restaurantService.getById(ownerId);
        if (restaurant) {
          return {
            _id: restaurant._id,
            name: restaurant.name,
            email: restaurant.email,
            role: "restaurant",
          };
        }
      } catch (innerError) {
        // Neither user nor restaurant
        return null;
      }
    }
    return null;
  }

  async getEvents(
    isAdmin: boolean = false,
    status?: "accepted" | "rejected" | "pending"
  ): Promise<IEvent[]> {
    const events = await this.eventRepository.getEvents(isAdmin, status);
    return await Promise.all(
      events.map(async (event) => {
        if (!event.user && event.owner) {
          event.user = (await this.getOwnerData(event.owner)) as any;
        }
        return await this.attachSignedUrl(event);
      })
    );
  }

  async getEventById(id: string, eventId: string): Promise<IEvent> {
    const event = await this.eventRepository.getEvent(id, eventId);
    if (event && !event.user && event.owner) {
      event.user = (await this.getOwnerData(event.owner)) as any;
    }
    return await this.attachSignedUrl(event);
  }

  async getEventsByUserId(id: string): Promise<IEvent[]> {
    const events = await this.eventRepository.getEventsByUserId(id);
    return await Promise.all(
      events.map(async (event) => {
        if (!event.user && event.owner) {
          event.user = (await this.getOwnerData(event.owner)) as any;
        }
        return await this.attachSignedUrl(event);
      })
    );
  }

  async createEvent(id: string, data: IEvent): Promise<IEvent> {
    // Fetch owner data before creating to denormalize
    const ownerData = await this.getOwnerData(id);
    if (ownerData) {
      data.user = ownerData as any;
    }

    const createdEvent = await this.eventRepository.createEvent(id, data);

    if (!createdEvent) {
      throw new Error(`User ${id} not found or event could not be created.`);
    }

    return await this.attachSignedUrl(createdEvent);
  }

  async updateEvent(userId: string, event: Partial<IEvent>): Promise<IEvent> {
    const updated = await this.eventRepository.updateEvent(userId, event);

    if (!updated) {
      throw new Error(`Event ${event._id} not found for user ${userId}.`);
    }

    // Ensure user data is present in response
    if (!updated.user && updated.owner) {
      updated.user = (await this.getOwnerData(updated.owner)) as any;
    }

    return await this.attachSignedUrl(updated);
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    return await this.eventRepository.deleteEvent(id, eventId);
  }

  async acceptEvent(eventId: string): Promise<IEvent> {
    const event = await this.eventRepository.acceptEvent("", eventId);
    if (event && !event.user && event.owner) {
      event.user = (await this.getOwnerData(event.owner)) as any;
    }
    return await this.attachSignedUrl(event);
  }

  async rejectEvent(eventId: string): Promise<IEvent> {
    const event = await this.eventRepository.rejectEvent("", eventId);
    if (event && !event.user && event.owner) {
      event.user = (await this.getOwnerData(event.owner)) as any;
    }
    return await this.attachSignedUrl(event);
  }

  async attendEvent(id: string, eventId: string): Promise<IEvent> {
    const event = await this.eventRepository.attendEvent(id, eventId);
    if (event && !event.user && event.owner) {
      event.user = (await this.getOwnerData(event.owner)) as any;
    }
    return await this.attachSignedUrl(event);
  }
}

export default EventService;
