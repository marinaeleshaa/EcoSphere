import { inject, injectable } from "tsyringe";
import type { IReviewRepository } from "./review.repository";
import type { IRestaurantRepository } from "../restaurant/restaurant.repository";
import { Prisma, Reviews } from "@/generated/prisma/client";

export interface IReviewService {
	create(data: Prisma.ReviewsCreateInput): Promise<Reviews>;
	getAll(restaurantId?: string): Promise<Reviews[]>;
	getById(id: string): Promise<Reviews | null>;
	update(id: string, data: Prisma.ReviewsUpdateInput): Promise<Reviews | null>;
	delete(id: string): Promise<Reviews | null>;
}

@injectable()
class ReviewService implements IReviewService {
	constructor(
		@inject("IReviewRepository")
		private readonly reviewRepository: IReviewRepository,
		@inject("IRestaurantRepository")
		private readonly restaurantRepository: IRestaurantRepository
	) {}

	private async updateRestaurantRating(restaurantId: string) {
		const reviews = await this.reviewRepository.getAll(restaurantId);
		if (reviews.length === 0) {
			await this.restaurantRepository.updateById(restaurantId, { rating: 0 });
			return;
		}
		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
		const averageRating = totalRating / reviews.length;
		await this.restaurantRepository.updateById(restaurantId, {
			rating: averageRating,
		});
	}

	async create(data: Prisma.ReviewsCreateInput): Promise<Reviews> {
		const review = await this.reviewRepository.create(data);
		await this.updateRestaurantRating(review.restaurantId);
		return review;
	}

	async getAll(restaurantId?: string): Promise<Reviews[]> {
		return await this.reviewRepository.getAll(restaurantId);
	}

	async getById(id: string): Promise<Reviews | null> {
		return await this.reviewRepository.getById(id);
	}

	async update(
		id: string,
		data: Prisma.ReviewsUpdateInput
	): Promise<Reviews | null> {
		const review = await this.reviewRepository.update(id, data);
		if (review) {
			await this.updateRestaurantRating(review.restaurantId);
		}
		return review;
	}

	async delete(id: string): Promise<Reviews | null> {
		const review = await this.reviewRepository.delete(id);
		if (review) {
			await this.updateRestaurantRating(review.restaurantId);
		}
		return review;
	}
}

export default ReviewService;
