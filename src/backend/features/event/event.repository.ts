import { injectable } from "tsyringe";
import { IEvent, UserModel } from "../user/user.model";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IEventRepository {
  getAll(): Promise<IEvent[]>;
  create(data: Partial<IEvent>): Promise<IEvent>;
  getById(id: string): Promise<IEvent>;
  updateById(id: string, data: Partial<IEvent>): Promise<IEvent>;
  deleteById(id: string): Promise<IEvent>;
}

@injectable()
class EventRepository {
  async getAll() {
    await DBInstance.getConnection();
    return await UserModel.find({}, { events: 1 });
  }
}
