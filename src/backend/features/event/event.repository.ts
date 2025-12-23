import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { IEvent, EventModel } from "../event/event.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { Types } from "mongoose";

export interface IEventRepository {
  getEvents(): Promise<IEvent[]>;
  getEvent(id: string, eventId: string): Promise<IEvent>;
  getEventsByUserId(id: string): Promise<IEvent[]>;
  createEvent(id: string, data: IEvent): Promise<IEvent>;
  updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent>;
  deleteEvent(id: string, eventId: string): Promise<IEvent>;
  acceptEvent(id: string, eventId: string): Promise<IEvent>;
  rejectEvent(id: string, eventId: string): Promise<IEvent>;
  getUserIdByEventId(eventId: string): Promise<IEvent>;
  attendEvent(id: string, eventId: string): Promise<IEvent>;
}

@injectable()
class EventRepository {
  async getEvents(): Promise<IEvent[]> {
    await DBInstance.getConnection();

    return EventModel.find({
      eventDate: { $gte: new Date() },
      isAccepted: true,
    })
      .populate("user", "firstName phoneNumber email")
      .lean()
      .exec();
  }

  async getEvent(userId: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findOne({
      _id: eventId,
      user: userId,
    })
      .lean()
      .exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async getEventsByUserId(userId: string): Promise<IEvent[]> {
    await DBInstance.getConnection();

    return EventModel.find({ user: userId }).lean().exec();
  }

  async createEvent(userId: string, data: IEvent): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.create({
      ...data,
      user: userId,
    });

    return event.toObject();
  }

  async updateEvent(userId: string, data: Partial<IEvent>): Promise<IEvent> {
    await DBInstance.getConnection();

    const event = await EventModel.findOneAndUpdate(
      { _id: data._id, user: userId },
      { ...data, updatedAt: new Date() },
      { new: true },
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
      user: userId,
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
      { _id: 1 },
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
      { new: true },
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
      { new: true },
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
      { new: true },
    )
      .lean()
      .exec();

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }
}

export default EventRepository;
