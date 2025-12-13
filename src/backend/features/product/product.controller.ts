import { injectable, inject } from "tsyringe";
import { type IProductService } from "./product.service";
import { IRestaurant } from "../restaurant/restaurant.model";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductPageOptions,
  PaginatedProductResponse,
} from "./dto/product.dto";

@injectable()
export class ProductController {
  constructor(
    @inject("ProductService") private readonly productService: IProductService
  ) {}

  async getAll(): Promise<ProductResponse[]> {
    return await this.productService.getAllProducts();
  }

  async getById(id: string): Promise<ProductResponse | null> {
    return await this.productService.getProductById(id);
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
}
