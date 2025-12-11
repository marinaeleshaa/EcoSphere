import React from "react";
import { getCurrentUser } from "@/backend/utils/authHelper";
import { rootContainer } from "@/backend/config/container";
import { ProductController } from "@/backend/features/product/product.controller";
import ProductsClient from "@/components/layout/restaurant/products/ProductsClient";
import {
	ProductResponse,
	PaginatedProductResponse,
} from "@/backend/features/product/dto/product.dto";

type ProductMetadata = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
} | null;

export default async function ProductsPage() {
	// Server-side: fetch current user and initial product list
	const user = await getCurrentUser();
	const restaurantId = user?.id as string | undefined;

	let initialProducts: ProductResponse[] = [];
	let initialMetadata: ProductMetadata = null;

	if (restaurantId) {
		try {
			const controller = rootContainer.resolve(ProductController);
			const result = await controller.getByRestaurantId(restaurantId, {
				page: 1,
				limit: 12,
			});

			// result can be PaginatedProductResponse or ProductResponse[]
			if (Array.isArray(result)) {
				initialProducts = result;
			} else if (
				typeof result === "object" &&
				result !== null &&
				"data" in result
			) {
				const paginated = result as PaginatedProductResponse;
				initialProducts = paginated.data;
				initialMetadata = paginated.metadata;
			}
		} catch (error) {
			// Server-side: log and continue, client will handle user feedback
			console.error("Failed to load initial products:", error);
		}
	}

	return (
		<div className="pt-15 h-[calc(100vh-20px)] w-[80%] mx-auto flex flex-col space-y-4">
			<ProductsClient
				initialProducts={initialProducts}
				initialMetadata={initialMetadata}
				restaurantId={restaurantId}
			/>
		</div>
	);
}
