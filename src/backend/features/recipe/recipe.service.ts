import { injectable, inject } from "tsyringe";
import type { IRecipeRepository } from "./recipe.repository";
import type { IAIService } from "../ai/ai.service";
import { IRecipe } from "./recipe.model";

export interface IRecipeService {
  generateAndSaveRecipe(
    userId: string,
    ingredients: string[]
  ): Promise<IRecipe>;
  getUserRecipes(userId: string): Promise<IRecipe[]>;
  deleteRecipe(recipeId: string, userId: string): Promise<boolean>;
}

@injectable()
export class RecipeService implements IRecipeService {
  constructor(
    @inject("RecipeRepository")
    private readonly recipeRepository: IRecipeRepository,
    @inject("AIService") private readonly aiService: IAIService
  ) {}

  async generateAndSaveRecipe(
    userId: string,
    ingredients: string[]
  ): Promise<IRecipe> {
    // 1. Generate Recipe via AI
    const generatedRecipe = await this.aiService.generateZeroWasteRecipe(
      ingredients
    );

    // 2. Prepare Data for DB
    const recipeData: Partial<IRecipe> = {
      userId: userId as any,
      ingredients,
      ...generatedRecipe,
    };

    // 3. Save to DB
    return await this.recipeRepository.create(recipeData);
  }

  async getUserRecipes(userId: string): Promise<IRecipe[]> {
    return await this.recipeRepository.findByUserId(userId);
  }

  async deleteRecipe(recipeId: string, userId: string): Promise<boolean> {
    const output = await this.recipeRepository.deleteById(recipeId, userId);
    return !!output; // Returns true if document found and deleted
  }
}
