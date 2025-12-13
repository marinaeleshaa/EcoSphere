import { injectable, inject } from "tsyringe";
import { type IProductRepository } from "./product.repository";
import { IRestaurant } from "../restaurant/restaurant.model";
import { ImageService } from "@/backend/services/image.service";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductPageOptions,
  PaginatedProductResponse,
} from "./dto/product.dto";

export interface IProductService {
  getAllProducts(): Promise<ProductResponse[]>;
  getProductById(productId: string): Promise<ProductResponse | null>;
  getProductsByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]>;
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
    private readonly productRepository: IProductRepository,
    @inject("ImageService") private readonly imageService: ImageService
  ) {}

  private async attachSignedUrl(
    product: ProductResponse
  ): Promise<ProductResponse> {
    if (product?.avatar?.key) {
      try {
        const url = await this.imageService.getSignedUrl(product.avatar.key);
        // We ensure we don't mutate the original read-only object if it's frozen,
        // essentially returning a new object or modifying it if allowed.
        // For standard JS objects from Mongoose lean/aggregate, this is fine.
        product.avatar.url = url;
      } catch (error) {
        console.error(
          `Failed to generate signed URL for product ${product._id}:`,
          error
        );
      }
    }
    return product;
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await this.productRepository.findAllProducts();
    return await Promise.all(products.map((p) => this.attachSignedUrl(p)));
  }

  async getProductById(productId: string): Promise<ProductResponse | null> {
    const product = await this.productRepository.findProductById(productId);
    if (!product) throw new Error("Product not found");
    return await this.attachSignedUrl(product);
  }

  async getProductsByRestaurantId(
    restaurantId: string,
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]> {
    const result = await this.productRepository.findProductsByRestaurantId(
      restaurantId,
      options
    );

    if (Array.isArray(result)) {
      return await Promise.all(result.map((p) => this.attachSignedUrl(p)));
    } else {
      // It's PaginatedProductResponse
      const productsWithUrls = await Promise.all(
        result.data.map((p) => this.attachSignedUrl(p))
      );
      return {
        ...result,
        data: productsWithUrls,
      };
    }
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
