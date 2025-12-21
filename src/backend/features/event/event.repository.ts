import { injectable } from "tsyringe";
import { IEvent, IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";
import mongoose, { Types } from "mongoose";

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
  getEventById(eventId: string): Promise<IEvent>;
}

@injectable()
class EventRepository {
  async getEvents() {
    await DBInstance.getConnection();

    return await UserModel.aggregate([
      { $unwind: "$events" },
      {
        $match: {
          "events.eventDate": { $gte: new Date() },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$events",
              {
                user: {
                  _id: "$_id",
                  firstName: "$firstName",
                  phoneNumber: "$phoneNumber",
                  email: "$email",
                },
              },
            ],
          },
        },
      },
    ]);
  }

  async getEvent(id: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();
    const data = await UserModel.findOne(
      { _id: id },
      {
        events: {
          $elemMatch: { _id: eventId },
        },
      }
    )
      .lean<Pick<IUser, "events">>()
      .exec();

    return data as IEvent;
  }

  async getEventsByUserId(userId: string): Promise<IEvent[]> {
    await DBInstance.getConnection();

    const user = await UserModel.findById(userId, { events: 1 })
      .lean<{ events: IEvent[] }>()
      .exec();

    return user?.events || [];
  }

  async createEvent(userId: string, eventData: IEvent): Promise<IEvent> {
    await DBInstance.getConnection();

    const eventId = new mongoose.Types.ObjectId();

    const eventToInsert = {
      ...eventData,
      _id: eventId,
    };

    const result = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { events: eventToInsert } },
      {
        new: true,
        select: {
          events: { $elemMatch: { _id: eventId } },
        },
      }
    )
      .lean<{ events: IEvent[] }>()
      .exec();

    console.log(result);
    if (!result?.events || result.events.length === 0) {
      throw new Error(`Event with ID ${eventId} not found for user ${userId}.`);
    }

    return result.events[0];
  }

  async updateEvent(
    userId: string,
    eventData: Partial<IEvent>
  ): Promise<IEvent> {
    await DBInstance.getConnection();

    const eventId = eventData._id;

    const updateFields: Record<string, any> = {};

    for (const [key, value] of Object.entries(eventData)) {
      if (key !== "_id") {
        updateFields[`events.$.${key}`] = value;
      }
    }

    updateFields["events.$.updatedAt"] = new Date();

    const result = await UserModel.findOneAndUpdate(
      { _id: userId, "events._id": eventId },
      { $set: updateFields },
      {
        new: true,
        select: {
          events: { $elemMatch: { _id: eventId } },
        },
      }
    )
      .lean<{ events: IEvent[] }>()
      .exec();

    if (!result?.events || result.events.length === 0) {
      throw new Error(`Event with ID ${eventId} not found for user ${userId}.`);
    }

    return result.events[0];
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();
    const eventProjection = await UserModel.findOne(
      { _id: id },
      { events: { $elemMatch: { _id: eventId } } }
    )
      .lean<Pick<IUser, "events">>()
      .exec();

    if (!eventProjection?.events || eventProjection.events.length === 0) {
      throw new Error(`Event with ID ${eventId} not found for user ${id}.`);
    }

    const deletedEvent: IEvent = eventProjection.events[0];

    await UserModel.updateOne(
      { _id: id },
      {
        $pull: { events: { _id: eventId } },
      }
    ).exec();

    return deletedEvent;
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

  async acceptEvent(id: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const eventProjection = await UserModel.findOne(
      { _id: id },
      { events: { $elemMatch: { _id: eventId } } }
    )
      .lean<Pick<IUser, "events">>()
      .exec();

    if (!eventProjection?.events || eventProjection.events.length === 0) {
      throw new Error(`Event with ID ${eventId} not found for user ${id}.`);
    }

    const updatedEvent: IEvent = eventProjection.events[0];

    await UserModel.updateOne(
      { _id: id, "events._id": eventId },
      { $set: { "events.$.isAccepted": true, "events.$.isEventNew": false } }
    ).exec();

    return updatedEvent;
  }

  async rejectEvent(id: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();
    const eventProjection = await UserModel.findOne(
      {},
      { events: { $elemMatch: { _id: eventId } } }
    )
      .lean<Pick<IUser, "events">>()
      .exec();

    if (!eventProjection?.events || eventProjection.events.length === 0) {
      throw new Error(`Event with ID ${eventId} not found for user ${id}.`);
    }

    const updatedEvent: IEvent = eventProjection.events[0];

    await UserModel.updateOne(
      { "events._id": eventId },
      { $set: { "events.$.isAccepted": false, "events.$.isEventNew": false } }
    ).exec();

    return updatedEvent;
  }

  async attendEvent(userId: string, eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();

    const updatedUser = await UserModel.findOneAndUpdate(
      { "events._id": eventId },
      {
        $addToSet: {
          "events.$.attenders": new Types.ObjectId(userId),
        },
        $set: {
          "events.$.updatedAt": new Date(),
        },
      },
      {
        new: true,
        projection: { events: 1 },
      }
    ).lean<IUser>();

    if (!updatedUser?.events) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }

    const updatedEvent = updatedUser.events.find(
      (e) => e._id.toString() === eventId
    );

    if (!updatedEvent) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }

    return updatedEvent as IEvent;
  }

  async getEventById(eventId: string): Promise<IEvent> {
    await DBInstance.getConnection();
    const user = await UserModel.findOne(
      { "events._id": eventId },
      { events: { $elemMatch: { _id: eventId } } }
    )
      .lean<Pick<IUser, "events">>()
      .exec();

    if (!user?.events || user.events.length === 0) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }

    return user.events[0] as IEvent;
  }
}

export default EventRepository;
