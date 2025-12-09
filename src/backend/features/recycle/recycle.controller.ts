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
}
