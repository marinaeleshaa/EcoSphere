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
  // Analytics methods for AI chatbot
  getTotalCarbonSaved(): Promise<number>;
  getPendingRecyclingRequests(limit?: number): Promise<IRecycle[]>;
  getRecyclingStatistics(): Promise<{
    totalEntries: number;
    totalCarbonSaved: number;
    totalWeight: number;
  }>;
  getRecentRecyclingEntries(limit?: number): Promise<IRecycle[]>;
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

  async getRecycleEntriesByEmail(userId: string): Promise<IRecycle[]> {
    await DBInstance.getConnection();
    return await RecycleModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean<IRecycle[]>()
      .exec();
  }

  // Analytics methods for AI chatbot
  async getTotalCarbonSaved(): Promise<number> {
    const result = await RecycleModel.aggregate([
      {
        $group: {
          _id: null,
          totalCarbon: { $sum: "$totalCarbonSaved" },
        },
      },
    ]).exec();

    return result[0]?.totalCarbon || 0;
  }

  async getPendingRecyclingRequests(limit: number = 20): Promise<IRecycle[]> {
    return await RecycleModel.find({ isVerified: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IRecycle[]>()
      .exec();
  }

  async getRecyclingStatistics(): Promise<{
    totalEntries: number;
    totalCarbonSaved: number;
    totalWeight: number;
  }> {
    const result = await RecycleModel.aggregate([
      {
        $group: {
          _id: null,
          totalEntries: { $count: {} },
          totalCarbonSaved: { $sum: "$totalCarbonSaved" },
          totalWeight: {
            $sum: {
              $reduce: {
                input: "$recycleItems",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.weight"] },
              },
            },
          },
        },
      },
    ]).exec();

    return (
      result[0] || {
        totalEntries: 0,
        totalCarbonSaved: 0,
        totalWeight: 0,
      }
    );
  }

  async getRecentRecyclingEntries(limit: number = 10): Promise<IRecycle[]> {
    return await RecycleModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("firstName lastName totalCarbonSaved createdAt")
      .lean<IRecycle[]>()
      .exec();
  }
}
