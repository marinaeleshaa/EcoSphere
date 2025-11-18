import { injectable } from "tsyringe";
import { prisma } from "@/lib/prisma";
import { Prisma, Reviews } from "@/generated/prisma/client";

export interface IReviewRepository {
  create(data: Prisma.ReviewsCreateInput): Promise<Reviews>;
  getAll(restaurantId?: string): Promise<Reviews[]>;
  getById(id: string): Promise<Reviews | null>;
  update(id: string, data: Prisma.ReviewsUpdateInput): Promise<Reviews | null>;
  delete(id: string): Promise<Reviews | null>;
}

@injectable()
class ReviewRepository implements IReviewRepository {
  async create(data: Prisma.ReviewsCreateInput): Promise<Reviews> {
    return await prisma.reviews.create({
      data,
    });
  }

  async getAll(restaurantId?: string): Promise<Reviews[]> {
    if (restaurantId) {
      return await prisma.reviews.findMany({
        where: { restaurantId },
      });
    }
    return await prisma.reviews.findMany();
  }

  async getById(id: string): Promise<Reviews | null> {
    return await prisma.reviews.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.ReviewsUpdateInput): Promise<Reviews | null> {
    return await prisma.reviews.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Reviews | null> {
    return await prisma.reviews.delete({
      where: { id },
    });
  }
}

export default ReviewRepository;
