import { injectable } from "tsyringe";
import { IRecycle, RecycleModel } from "./recycle.model";
import { DBInstance } from "@/backend/config/dbConnect";

export interface IRecycleRepository {
  createRecycleEntry(data: Partial<IRecycle>): Promise<IRecycle>;
  getRecycleEntryById(id: string): Promise<IRecycle>;
  updateRecycleEntry(id: string, data: Partial<IRecycle>): Promise<IRecycle>;
  deleteRecycleEntry(id: string): Promise<IRecycle>;
  listRecycleEntries(): Promise<IRecycle[]>;
  getRecycleEntriesByEmail(email: string): Promise<IRecycle[]>;
}

@injectable()
export class RecycleRepository implements IRecycleRepository {
  async createRecycleEntry(data: Partial<IRecycle>): Promise<IRecycle> {
    await DBInstance.getConnection();
    return await RecycleModel.create(data);
  }

  async getRecycleEntryById(id: string): Promise<IRecycle> {
    await DBInstance.getConnection();
    const response = await RecycleModel.findById(id).lean<IRecycle>().exec();
    return response!;
  }

  async updateRecycleEntry(
    id: string,
    data: Partial<IRecycle>,
  ): Promise<IRecycle> {
    await DBInstance.getConnection();
    const response = await RecycleModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .lean<IRecycle>()
      .exec();
    return response!;
  }

  async deleteRecycleEntry(id: string): Promise<IRecycle> {
    await DBInstance.getConnection();
    const response = await RecycleModel.findByIdAndDelete(id)
      .lean<IRecycle>()
      .exec();
    return response!;
  }

  async listRecycleEntries(): Promise<IRecycle[]> {
    await DBInstance.getConnection();
    return await RecycleModel.find().lean<IRecycle[]>().exec();
  }

  async getRecycleEntriesByEmail(email: string): Promise<IRecycle[]> {
    await DBInstance.getConnection();
    return await RecycleModel.find({ email })
      .sort({ createdAt: -1 })
      .lean<IRecycle[]>()
      .exec();
  }
}
