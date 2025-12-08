import { injectable, inject } from "tsyringe";
import { type IProductRepository } from "./product.repository";
import {  IRestaurant } from "../restaurant/restaurant.model";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
} from "./dto/product.dto";

export interface IProductService {
  getAllProducts(): Promise<ProductResponse[]>;
  getProductById(productId: string): Promise<ProductResponse | null>;
  getProductsByRestaurantId(restaurantId: string): Promise<ProductResponse[]>;
  addProduct(
    restaurantId: string,
    productData: CreateProductDTO
  ): Promise<IRestaurant>;
  updateProduct(
    restaurantId: string,
    productId: string,
    productData: UpdateProductDTO
  ): Promise<IRestaurant>;
  deleteProduct(restaurantId: string, productId: string): Promise<IRestaurant>;
}

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository
  ) {}

  async getAllProducts(): Promise<ProductResponse[]> {
    return await this.productRepository.findAllProducts();
  }

  async getProductById(productId: string): Promise<ProductResponse | null> {
    const product = await this.productRepository.findProductById(productId);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getProductsByRestaurantId(
    restaurantId: string
  ): Promise<ProductResponse[]> {
    return await this.productRepository.findProductsByRestaurantId(
      restaurantId
    );
  }

  async addProduct(
    restaurantId: string,
    productData: CreateProductDTO
  ): Promise<IRestaurant> {
    // Validate required fields
    if (
      !productData.title ||
      !productData.subtitle ||
      productData.price == null
    ) {
      throw new Error("Title, subtitle, and price are required");
    }
    const result = await this.productRepository.addProduct(
      restaurantId,
      productData
    );
    if (!result) throw new Error("Restaurant not found or update failed");
    return result;
  }

  async updateProduct(
    restaurantId: string,
    productId: string,
    productData: UpdateProductDTO
  ): Promise<IRestaurant> {
    const result = await this.productRepository.updateProduct(
      restaurantId,
      productId,
      productData
    );
    if (!result) throw new Error("Product not found or update failed");
    return result;
  }

  async deleteProduct(
    restaurantId: string,
    productId: string
  ): Promise<IRestaurant> {
    const result = await this.productRepository.deleteProduct(
      restaurantId,
      productId
    );
    if (!result) throw new Error("Product not found or delete failed");
    return result;
  }
}
