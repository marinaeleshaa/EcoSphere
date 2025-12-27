import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { IEvent, EventModel } from "../event/event.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { Types } from "mongoose";

export interface IEventRepository {
  getEvents(
    isAdmin?: boolean,
    status?: "accepted" | "rejected" | "pending"
  ): Promise<IEvent[]>;
  getEvent(id: string, eventId: string): Promise<IEvent>;
  getPublicEvent(eventId: string): Promise<IEvent>;
  getEventsByUserId(id: string): Promise<IEvent[]>;
  createEvent(id: string, data: IEvent): Promise<IEvent>;
  updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent>;
  deleteEvent(id: string, eventId: string): Promise<IEvent>;
  acceptEvent(id: string, eventId: string): Promise<IEvent>;
  rejectEvent(id: string, eventId: string): Promise<IEvent>;
  getUserIdByEventId(eventId: string): Promise<IEvent>;
  attendEvent(id: string, eventId: string): Promise<IEvent>;
  // Analytics method for AI chatbot
  getUpcomingEvents(limit?: number): Promise<IEvent[]>;
  getTotalEventsCount(): Promise<number>;
  getEventStatistics(): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    totalAttendees: number;
  }>;
  getEventsByOrganizerLimited(
    userId: string,
    limit?: number
  ): Promise<IEvent[]>;
}

@injectable()
class EventRepository {
  async getEvents(
    isAdmin: boolean = false,
    status?: "accepted" | "rejected" | "pending"
  ): Promise<IEvent[]> {
    await DBInstance.getConnection();

    const query: any = {
      eventDate: { $gte: new Date() },
    };

    if (isAdmin) {
      if (status === "pending") {
        query.isEventNew = true;
      } else if (status === "accepted") {
        query.isAccepted = true;
        query.isEventNew = false;
      } else if (status === "rejected") {
        query.isAccepted = false;
        query.isEventNew = false;
      }
    } else {
      query.isAccepted = true;
    }

    return EventModel.find(query).lean().exec();
  }

  async getEvent(userId: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findOne({
      _id: eventId,
      owner: userId,
    })
      .lean()
      .exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async getPublicEvent(eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findById(eventId).lean().exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async getEventsByUserId(userId: string): Promise<IEvent[]> {
    await DBInstance.getConnection();

    return EventModel.find({ owner: userId }).lean().exec();
  }

  async createEvent(id: string, data: IEvent): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.create({
      ...data,
      owner: id,
    });

    return event.toObject();
  }

  async updateEvent(userId: string, data: Partial<IEvent>): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findOneAndUpdate(
      { _id: data._id, owner: userId },
      { ...data, updatedAt: new Date() },
      { new: true }
    )
      .lean()
      .exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async deleteEvent(userId: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findOneAndDelete({
      _id: eventId,
      owner: userId,
    })
      .lean()
      .exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async getUserIdByEventId(eventId: string): Promise<IUser> {
    await DBInstance.getConnection();
    const response = await UserModel.findOne(
      { "events._id": eventId },
      { _id: 1 }
    )
      .lean<IUser>()
      .exec();
    return response!;
  }

  async acceptEvent(_: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findByIdAndUpdate(
      eventId,
      { isAccepted: true, isEventNew: false },
      { new: true }
    )
      .lean()
      .exec();

    if (!event) throw new Error("Event not found");

    return event;
  }

  async rejectEvent(_: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findByIdAndUpdate(
      eventId,
      { isAccepted: false, isEventNew: false },
      { new: true }
    )
      .lean()
      .exec();

    if (!event) throw new Error("Event not found");

    return event;
  }

  async attendEvent(userId: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findByIdAndUpdate(
      eventId,
      {
        $addToSet: { attenders: new Types.ObjectId(userId) },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  // Analytics method for AI chatbot
  async getUpcomingEvents(limit: number = 10): Promise<IEvent[]> {
    await DBInstance.getConnection();

    return await EventModel.find({
      eventDate: { $gte: new Date() },
      isAccepted: true,
    })
      .sort({ eventDate: 1 }) // Earliest events first
      .limit(limit)
      .populate("user", "firstName phoneNumber email")
      .lean()
      .exec();
  }

  async getTotalEventsCount(): Promise<number> {
    await DBInstance.getConnection();

    const count = await EventModel.countDocuments({}).exec();
    return count;
  }

  async getEventStatistics(): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    totalAttendees: number;
  }> {
    await DBInstance.getConnection();

    const result = await EventModel.aggregate([
      {
        $group: {
          _id: null,
          totalEvents: { $count: {} },
          upcomingEvents: {
            $sum: {
              $cond: [{ $gte: ["$eventDate", new Date()] }, 1, 0],
            },
          },
          totalAttendees: {
            $sum: { $size: { $ifNull: ["$attenders", []] } },
          },
        },
      },
    ]).exec();

    return (
      result[0] || {
        totalEvents: 0,
        upcomingEvents: 0,
        totalAttendees: 0,
      }
    );
  }

  async getEventsByOrganizerLimited(
    userId: string,
    limit: number = 10
  ): Promise<IEvent[]> {
    await DBInstance.getConnection();

    return await EventModel.find({ user: userId })
      .sort({ eventDate: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}

export default EventRepository;
