import { injectable } from "tsyringe";
import { IEvent, IUser, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IEventRepository {
  getEvents(): Promise<IEvent[]>;
  createEvent(id: string, data: Partial<IEvent>): Promise<IEvent>;
  getEvent(id: string, eventId: string): Promise<IEvent>;
  updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent>;
  deleteEvent(id: string, eventId: string): Promise<IEvent>;
}

@injectable()
class EventRepository {
  async getEvents() {
    await DBInstance.getConnection();
    return await UserModel.find({}).select("events").lean().exec();
  }

  async getEvent(id: string, eventId: string): Promise<IEvent> {
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

  async createEvent(id: string, data: Partial<IEvent>): Promise<any> {
    // TODO: Check returned object from mongo
    const user = await UserModel.findById({ _id: id })
      .select("events _id")
      .lean()
      .exec();
    return user;
  }

  async updateEvent(id: string, data: Partial<IEvent>): Promise<any> {
    // TODO: Implement the update logic
    const user = await UserModel.findById({ _id: id })
      .select("events _id")
      .lean()
      .exec();
    return user;
  }

  async deleteEvent(id: string, eventId: string): Promise<IEvent> {
    const eventProjection = await UserModel.findOne(
      { _id: id },
      { events: { $elemMatch: { _id: eventId } } }
    )
      .lean<Pick<IUser, "events">>()
      .exec();

    if (
      !eventProjection ||
      !eventProjection.events ||
      eventProjection.events.length === 0
    ) {
      throw new Error(`Event with ID ${eventId} not found for user ${id}.`);
    }

    const deletedEvent: IEvent = eventProjection.events[0] as IEvent;

    await UserModel.updateOne(
      { _id: id },
      {
        $pull: { events: { _id: eventId } },
      }
    ).exec();

    return deletedEvent;
  }
}
