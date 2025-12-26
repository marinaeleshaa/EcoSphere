import { injectable, inject } from "tsyringe";
import { type IProductRepository } from "./product.repository";
import { IRestaurant } from "../restaurant/restaurant.model";
import { ImageService } from "@/backend/services/image.service";
import { type IAIService } from "../ai/ai.service";
import {
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductPageOptions,
  PaginatedProductResponse,
} from "./dto/product.dto";

export interface IProductService {
  getAllProducts(
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]>;
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
  addProductReview(productId: string, review: any): Promise<IRestaurant | null>;
}

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository,
    @inject("ImageService") private readonly imageService: ImageService,
    @inject("AIService") private readonly aiService: IAIService
  ) {}

  private async attachSignedUrl(
    product: ProductResponse
  ): Promise<ProductResponse> {
    // Removed verbose logging to avoid terminal flooding

    if (product?.avatar?.key) {
      try {
        const url = await this.imageService.getSignedUrl(product.avatar.key);
        // URL generated successfully
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

  async getAllProducts(
    options?: ProductPageOptions
  ): Promise<PaginatedProductResponse | ProductResponse[]> {
    const result = await this.productRepository.findAllProducts(options);

    const productsWithUrls = await Promise.all(
      result.data.map((p) => this.attachSignedUrl(p))
    );

    // If options are provided, return paginated response
    if (options && (options.page || options.limit)) {
      // console.log("productsWithUrls 1", productsWithUrls);
      return {
        data: productsWithUrls,
        metadata: result.metadata,
      };
    }

    // console.log("productsWithUrls 2", productsWithUrls);
    // Otherwise return just the array for backward compatibility
    return productsWithUrls;
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

    // Generate Sustainability Score (Automatic)
    try {
      const { score, reason } =
        await this.aiService.generateSustainabilityScore(
          productData.title,
          productData.subtitle
        );
      productData.sustainabilityScore = score;
      productData.sustainabilityReason = reason;
    } catch (error) {
      console.error("Failed to generate sustainability score:", error);
      // Fallback for debugging
      productData.sustainabilityScore = -1;
      productData.sustainabilityReason =
        "AI Analysis Failed. Check server logs.";
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

  async addProductReview(
    productId: string,
    review: any
  ): Promise<IRestaurant | null> {
    const result = await this.productRepository.addProductReview(
      productId,
      review
    );
    if (!result) throw new Error("Product not found for review");
    return result;
  }
}
