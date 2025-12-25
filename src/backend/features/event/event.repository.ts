import { injectable } from "tsyringe";
import { IUser, UserModel } from "../user/user.model";
import { IEvent, EventModel, EventPopulated } from "../event/event.model";
import { DBInstance } from "@/backend/config/dbConnect";
import { Types } from "mongoose";

export interface IEventRepository {
  getEvents(): Promise<EventPopulated[]>;
  getEvent(id: string, eventId: string): Promise<EventPopulated>;
  getEventsByUserId(id: string): Promise<EventPopulated[]>;
  createEvent(
    user: { id: string; role: string },
    data: IEvent,
  ): Promise<EventPopulated>;
  updateEvent(id: string, data: Partial<IEvent>): Promise<EventPopulated>;
  deleteEvent(id: string, eventId: string): Promise<EventPopulated>;
  acceptEvent(id: string, eventId: string): Promise<EventPopulated>;
  rejectEvent(id: string, eventId: string): Promise<EventPopulated>;
  getUserIdByEventId(eventId: string): Promise<IEvent>;
  attendEvent(id: string, eventId: string): Promise<EventPopulated>;
}

@injectable()
class EventRepository {
  async getEvents(): Promise<EventPopulated[]> {
    await DBInstance.getConnection();

    return EventModel.find({
      eventDate: { $gte: new Date() },
      isAccepted: true,
    })
      .populate("owner")
      .lean()
      .exec();
  }

  async getEvent(userId: string, eventId: string): Promise<EventPopulated> {
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

  async getEventsByUserId(userId: string): Promise<EventPopulated[]> {
    await DBInstance.getConnection();

    return EventModel.find({ owner: userId }).lean().exec();
  }

  async createEvent(
    user: { id: string; role: string },
    data: IEvent,
  ): Promise<EventPopulated> {
    await DBInstance.getConnection();

    const event = await EventModel.create({
      ...data,
      owner: user.id,
      ownerModel: user.role === "organizer" ? "User" : "Restaurant",
    });

    return event.toObject();
  }

  async updateEvent(
    userId: string,
    data: Partial<IEvent>,
  ): Promise<EventPopulated> {
    await DBInstance.getConnection();

    const event = await EventModel.findOneAndUpdate(
      { _id: data._id, owner: userId },
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

  async deleteEvent(userId: string, eventId: string): Promise<EventPopulated> {
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
      { _id: 1 },
    )
      .lean<IUser>()
      .exec();
    return response!;
  }

  async acceptEvent(_: string, eventId: string): Promise<EventPopulated> {
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

  async rejectEvent(_: string, eventId: string): Promise<EventPopulated> {
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

  async attendEvent(userId: string, eventId: string): Promise<EventPopulated> {
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
