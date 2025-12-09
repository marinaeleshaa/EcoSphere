import { inject, injectable } from "tsyringe";
import { type IRecycleRepository } from "./recycle.repository";
import { mapRecycleToResponse, RecycleResponse } from "./recycle.types";
import { IRecycle } from "./recycle.model";

export interface IRecycleService {
	createRecycleEntry(data: Partial<IRecycle>): Promise<RecycleResponse>;
	getRecycleEntryById(id: string): Promise<RecycleResponse>;
	updateRecycleEntry(
		id: string,
		data: Partial<IRecycle>
	): Promise<RecycleResponse>;
	deleteRecycleEntry(id: string): Promise<RecycleResponse>;
	listRecycleEntries(): Promise<RecycleResponse[]>;
}

@injectable()
export class RecycleService implements IRecycleService {
	constructor(
		@inject("RecycleRepository")
		private readonly recycleRepository: IRecycleRepository
	) {}

	async createRecycleEntry(data: Partial<IRecycle>): Promise<RecycleResponse> {
		const response = await this.recycleRepository.createRecycleEntry(data);
		return mapRecycleToResponse(response);
	}

	async getRecycleEntryById(id: string): Promise<RecycleResponse> {
		const response = await this.recycleRepository.getRecycleEntryById(id);
		return mapRecycleToResponse(response);
	}

	async updateRecycleEntry(
		id: string,
		data: Partial<IRecycle>
	): Promise<RecycleResponse> {
		const response = await this.recycleRepository.updateRecycleEntry(id, data);
		return mapRecycleToResponse(response);
	}

	async deleteRecycleEntry(id: string): Promise<RecycleResponse> {
		const response = await this.recycleRepository.deleteRecycleEntry(id);
		return mapRecycleToResponse(response);
	}

	async listRecycleEntries(): Promise<RecycleResponse[]> {
		const response = await this.recycleRepository.listRecycleEntries();
		const mappedData = response.map((item) => mapRecycleToResponse(item));
		return mappedData;
	}
}
