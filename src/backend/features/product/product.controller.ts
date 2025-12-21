import { injectable, inject } from "tsyringe";
import { type IProductService } from "./product.service";
import { IRestaurant } from "../restaurant/restaurant.model";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductPageOptions,
  PaginatedProductResponse,
  mapResponseToIProduct,
} from "./dto/product.dto";
import { IProduct } from "@/types/ProductType";

@injectable()
export class ProductController {
  constructor(
    @inject("ProductService") private readonly productService: IProductService
  ) {}

  async getAll(options?: ProductPageOptions): Promise<
    | IProduct[]
    | {
        data: IProduct[];
        metadata: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }
  > {
    const result = await this.productService.getAllProducts(options);

    if (Array.isArray(result)) {
      return result.map((product) => mapResponseToIProduct(product));
    } else {
      // It's PaginatedProductResponse
      const paginatedResult = result as PaginatedProductResponse;
      return {
        data: paginatedResult.data.map((product) =>
          mapResponseToIProduct(product)
        ),
        metadata: paginatedResult.metadata,
      };
    }
  }

  async getById(id: string): Promise<IProduct | null> {
    const product = await this.productService.getProductById(id);
    return product ? mapResponseToIProduct(product) : null;
  }

  async getByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]> {
    return await this.productService.getProductsByRestaurantId(
      restaurantId,
      options
    );
  }

  async addProduct(
    restaurantId: string,
    data: CreateProductDTO
  ): Promise<IRestaurant> {
    return await this.productService.addProduct(restaurantId, data);
  }

  async updateProduct(
    restaurantId: string,
    productId: string,
    data: UpdateProductDTO
  ): Promise<IRestaurant> {
    return await this.productService.updateProduct(
      restaurantId,
      productId,
      data
    );
  }

  async deleteProduct(
    restaurantId: string,
    productId: string
  ): Promise<IRestaurant> {
    return await this.productService.deleteProduct(restaurantId, productId);
  }

  async addProductReview(
    productId: string,
    review: any
  ): Promise<IRestaurant | null> {
    return await this.productService.addProductReview(productId, review);
  }
}
