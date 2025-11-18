import { inject, injectable } from "tsyringe";
import type { IReviewService } from "./review.service";
import { Prisma, Reviews } from "@/generated/prisma/client";
import "reflect-metadata";

@injectable()
class ReviewController {
  constructor(
    @inject("IReviewService") private readonly reviewService: IReviewService
  ) {}

  async create(data: Prisma.ReviewsCreateInput): Promise<Reviews> {
    return await this.reviewService.create(data);
  }

  async getAll(restaurantId?: string): Promise<Reviews[]> {
    return await this.reviewService.getAll(restaurantId);
  }

  async getById(id: string): Promise<Reviews | null> {
    return await this.reviewService.getById(id);
  }

  async update(id: string, data: Prisma.ReviewsUpdateInput): Promise<Reviews | null> {
    return await this.reviewService.update(id, data);
  }

  async delete(id: string): Promise<Reviews | null> {
    return await this.reviewService.delete(id);
  }
}

export default ReviewController;
