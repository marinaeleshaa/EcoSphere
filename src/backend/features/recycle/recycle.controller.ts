import { inject, injectable } from "tsyringe";
import { type IRecycleService } from "./recycle.service";
import { RecycleRequest, RecycleResponse } from "./recycle.types";

@injectable()
export class RecycleController {
  constructor(
    @inject("RecycleService") private readonly recycleService: IRecycleService
  ) {}

  async createRecycleEntry(fromData: RecycleRequest): Promise<RecycleResponse> {
    if (!fromData) throw new Error("No data provided");

    return await this.recycleService.createRecycleEntry(fromData);
  }

  async getRecycleEntryById(id: string): Promise<RecycleResponse> {
    if (!id) throw new Error("No ID provided");

    return await this.recycleService.getRecycleEntryById(id);
  }

  async updateRecycleEntry(
    id: string,
    fromData: RecycleRequest
  ): Promise<RecycleResponse> {
    if (!id) throw new Error("No ID provided");
    if (!fromData) throw new Error("No data provided");

    return await this.recycleService.updateRecycleEntry(id, fromData);
  }
  async deleteRecycleEntry(id: string): Promise<RecycleResponse> {
    if (!id) throw new Error("No ID provided");

    return await this.recycleService.deleteRecycleEntry(id);
  }
  async listRecycleEntries(): Promise<RecycleResponse[]> {
    return await this.recycleService.listRecycleEntries();
  }

  async getRecycleEntriesByEmail(email: string): Promise<RecycleResponse[]> {
    if (!email) throw new Error("No email provided");
    return await this.recycleService.getRecycleEntriesByEmail(email);
  }

  async analyzeImages(formData: FormData): Promise<any> {
    try {
      const files = formData.getAll("files") as File[]; // Cast to File[] for better typing

      if (!files || files.length === 0) {
        throw new Error("No files uploaded");
      }

      const result = await this.recycleService.analyzeImages(files);
      return result; // Return data directly
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error; // Let route handler handle error response
    }
  }

  async calculateManual(req: Request): Promise<any> {
    try {
      const body = await req.json();
      const { items } = body; // Expects { items: [{ type: 'Plastic', amount: 0.5 }] }

      if (!items || !Array.isArray(items)) {
        return Response.json(
          { error: "Invalid items format" },
          { status: 400 }
        );
      }

      const result = await this.recycleService.calculateManualCarbon(items);
      return Response.json(result);
    } catch (error) {
      console.error("Calculation Error:", error);
      return Response.json({ error: "Calculation failed" }, { status: 500 });
    }
  }
}
